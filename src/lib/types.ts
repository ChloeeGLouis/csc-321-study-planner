import { z } from 'zod';

export const studyPlanFormSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  deadline: z.date({
    required_error: 'A deadline is required.',
  }).optional(),
  sections: z.array(z.object({ value: z.string().min(1, 'Section cannot be empty.') })).min(1, 'At least one section is required.'),
  studyMethods: z.array(z.string()).min(1, 'Please select at least one study method.'),
  frequency: z.string().min(1, 'Please select how many times a week you want to study.'),
  duration: z.string().min(1, 'Please specify the duration of each study session.'),
  userId: z.string().optional(),
});

export type StudyPlanFormValues = z.infer<typeof studyPlanFormSchema>;

export type StudySession = {
  id: string;
  userId: string;
  subject: string;
  deadline: { seconds: number; nanoseconds: number };
  sections: string[];
  studyMethods: string[];
  studySchedule: string;
  aiTips: string;
  createdAt: { seconds: number; nanoseconds: number };
  frequency: number;
  duration: number;
}
