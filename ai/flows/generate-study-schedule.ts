'use server';

/**
 * @fileOverview A study schedule generation AI agent.
 *
 * - generateStudySchedule - A function that handles the study schedule generation process.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyScheduleInputSchema = z.object({
  subject: z.string().describe('The subject of study.'),
  deadline: z.string().describe('The deadline for the exam (e.g., MM/DD/YYYY).'),
  sections: z.array(z.string()).describe('The sections of the project to study from.'),
  studyMethods: z.array(z.string()).describe('The preferred study methods (e.g., practice quizzes, reading sections).'),
  frequency: z.number().describe('How many times a week the user wants to study.'),
  duration: z.number().describe('How long each study session should be in minutes.'),
});
export type GenerateStudyScheduleInput = z.infer<typeof GenerateStudyScheduleInputSchema>;

const GenerateStudyScheduleOutputSchema = z.object({
  studySchedule: z.string().describe('The generated study schedule.'),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;

export async function generateStudySchedule(input: GenerateStudyScheduleInput): Promise<GenerateStudyScheduleOutput> {
  return generateStudyScheduleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudySchedulePrompt',
  input: {schema: GenerateStudyScheduleInputSchema},
  output: {schema: GenerateStudyScheduleOutputSchema},
  prompt: `You are an AI study assistant that generates personalized study schedules based on user inputs.

  Subject: {{{subject}}}
  Deadline: {{{deadline}}}
  Sections: {{#each sections}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Study Methods: {{#each studyMethods}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Study Frequency: {{{frequency}}} times per week
  Session Duration: {{{duration}}} minutes per session

  Generate a study schedule, formatted in markdown, taking into account the subject, deadline, sections to study, preferred study methods, frequency, and session duration.
  The study schedule should be realistic and actionable. Break down the plan into weeks and days. Be specific about what to study in each session.`,
});

const generateStudyScheduleFlow = ai.defineFlow(
  {
    name: 'generateStudyScheduleFlow',
    inputSchema: GenerateStudyScheduleInputSchema,
    outputSchema: GenerateStudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
