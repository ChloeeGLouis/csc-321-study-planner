// src/ai/study-planner.ts
import {
    addDoc,
collection,
serverTimestamp,
getDocs,
query,
where,
orderBy,
limit as fsLimit,
} from "firebase/firestore";
import { auth, db, geminiModel } from "../firebase/client";

const SYSTEM_PROMPT = `
You are a study planner assistant for CSC 321.

Always respond ONLY with valid JSON using this shape:

{
"planSummary": string,
"tasks": [
{
"title": string,
"dueDate": string | null,
"estimatedMinutes": number,
"priority": "low" | "medium" | "high"
}
],
"notes": string
}

Do not include backticks or any text outside the JSON.
`;
// Replace the text above with your AI Studio prompt if needed

export type StudyTask = {
title: string;
dueDate: string | null;
estimatedMinutes: number;
priority: "low" | "medium" | "high";
};

export type GeminiStudyPlan = {
planSummary: string;
tasks: StudyTask[];
notes: string;
};

export type StudyInteraction = {
id: string;
prompt: string;
response: GeminiStudyPlan & { dictionaryDefinition?: any };
createdAt: Date | null;
};

async function getDictionaryDefinition(word: string): Promise<any> {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
      return { error: `Could not find definition for ${word}` };
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dictionary definition:', error);
    return { error: 'An error occurred while fetching the definition.' };
  }
}

export async function callGemini(promptData: {
  input: string;
  extra?: Record<string, unknown>;
}): Promise<GeminiStudyPlan & { dictionaryDefinition?: any }> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be signed in before calling Gemini");
  }

  const userPrompt = promptData.input;

  const fullPrompt = `${SYSTEM_PROMPT}\n\nUser input:\n${userPrompt}\n`;

  const result = await geminiModel.generateContent(fullPrompt);
  const text = result.response?.text() ?? "";

  let parsed: GeminiStudyPlan;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = {
      planSummary: text,
      tasks: [],
      notes:
        "Model did not return valid JSON; raw text placed in planSummary instead.",
    };
  }

  // Get dictionary definition for the first word of the plan summary
  let dictionaryDefinition;
  if (parsed.planSummary) {
    const firstWord = parsed.planSummary.split(' ')[0].replace(/[^a-zA-Z]/g, '');
    if (firstWord) {
      dictionaryDefinition = await getDictionaryDefinition(firstWord);
    }
  }

  const responseWithDefinition = {
    ...parsed,
    dictionaryDefinition,
  };

  await addDoc(collection(db, "aiInteractions"), {
    userId: user.uid,
    prompt: userPrompt,
    promptMeta: promptData.extra ?? null,
    response: responseWithDefinition, // Save the combined response
    rawResponseText: text,
    model: "gemini-2.0-flash",
    createdAt: serverTimestamp(),
  });

  return responseWithDefinition;
}

export async function getHistory(limitCount = 10): Promise<StudyInteraction[]> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be signed in before loading history");
  }

  const q = query(
    collection(db, "aiInteractions"),
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
    fsLimit(limitCount)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      prompt: data.prompt,
      response: data.response as GeminiStudyPlan & { dictionaryDefinition?: any },
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}
