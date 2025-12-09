'use server';

/**
 * @fileOverview This file defines a Genkit flow to provide personalized study tips using AI.
 *
 * It includes:
 * - `provideAiStudyTips`: The main function to generate study tips.
 * - `StudyTipsInput`: The input type for the function.
 * - `StudyTipsOutput`: The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyTipsInputSchema = z.object({
  subject: z.string().describe('The subject being studied.'),
  deadline: z.string().describe('The deadline for the exam, in YYYY-MM-DD format.'),
  sections: z.string().describe('The sections of the project to study from.'),
  studyMethods: z.string().describe('The preferred study methods (e.g., practice quizzes, reading sections).'),
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
  input: {schema: StudyTipsInputSchema},
  output: {schema: StudyTipsOutputSchema},
  prompt: `You are an AI-powered study assistant. Provide personalized study tips and strategies based on the following information:

Subject: {{{subject}}}
Deadline: {{{deadline}}}
Sections to Study: {{{sections}}}
Preferred Study Methods: {{{studyMethods}}}

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
    const {output} = await studyTipsPrompt(input);
    return output!;
  }
);
