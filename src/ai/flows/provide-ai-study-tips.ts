'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyTipsInputSchema = z.object({
  subject: z.string().describe('The subject being studied.'),
  deadline: z.string().describe('The deadline for the exam, in YYYY-MM-DD format.'),
  sections: z.string().describe('The sections of the project to study from.'),
  studyMethods: z.string().describe('The preferred study methods (e.g., practice quizzes, reading sections).'),
  define: z.string().optional().describe('A word to define using a dictionary API.'),
});
export type StudyTipsInput = z.infer<typeof StudyTipsInputSchema>;

const StudyTipsOutputSchema = z.object({
  studyTips: z.string().describe('Personalized study tips and strategies, formatted in markdown with lists.'),
});
export type StudyTipsOutput = z.infer<typeof StudyTipsOutputSchema>;

export async function provideAiStudyTips(input: StudyTipsInput): Promise<StudyTipsOutput> {
  return provideAiStudyTipsFlow(input);
}

const studyTipsPrompt = ai.definePrompt({
  name: 'studyTipsPrompt',
  input: {schema: StudyTipsInputSchema.extend({definition: z.string().optional()})},
  output: {schema: StudyTipsOutputSchema},
  prompt: `You are an AI-powered study assistant. Provide personalized study tips and strategies based on the following information:

Subject: {{{subject}}}
Deadline: {{{deadline}}}
Sections to Study: {{{sections}}}
Preferred Study Methods: {{{studyMethods}}}

{{#if define}}
I need help with the word: **{{{define}}}**
Here is the definition: **{{{definition}}}**
{{/if}}

Consider the subject, deadline, sections, and study methods to generate effective and tailored study tips.
Format the output as a markdown document. Use headings, bullet points, and numbered lists to make the tips clear, organized, and easy to follow.`,
});

const provideAiStudyTipsFlow = ai.defineFlow(
  {
    name: 'provideAiStudyTipsFlow',
    inputSchema: StudyTipsInputSchema,
    outputSchema: StudyTipsOutputSchema,
  },
  async input => {
    let definition: string | undefined;
    if (input.define) {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${input.define}`);
        if (response.ok) {
          const data = await response.json();
          definition = data[0]?.meanings[0]?.definitions[0]?.definition || 'No definition found.';
        } else {
          definition = 'Could not retrieve definition.';
        }
      } catch (error) {
        console.error('Dictionary API error:', error);
        definition = 'Error fetching definition.';
      }
    }

    const result = await studyTipsPrompt({...input, definition});
    const output = result.output;
    if (!output) {
      console.error('AI failed to generate study tips. Result:', JSON.stringify(result, null, 2));
      throw new Error('AI failed to generate study tips.');
    }
    return output;
  }
);
