'use server';

import { z } from 'zod';
import { generateStudySchedule } from '@/ai/flows/generate-study-schedule';
import { provideAiStudyTips } from '@/ai/flows/provide-ai-study-tips';

const formDataSchema = z.object({
    subject: z.string().min(1, 'Subject is required.'),
    deadline: z.string().min(1, 'Deadline is required.'),
    sections: z.array(z.string().min(1, 'Section cannot be empty.')).min(1, 'At least one section is required.'),
    studyMethods: z.array(z.string()).min(1, 'At least one study method is required.'),
    frequency: z.string().min(1, 'Frequency is required.'),
    duration: z.string().min(1, 'Duration is required.'),
    userId: z.string().optional(),
});

type StudyPlanFormData = z.infer<typeof formDataSchema>;

export type FormState = {
  message: string;
  isError: boolean;
  studySchedule?: string;
  studyTips?: string;
  formData?: StudyPlanFormData;
};

export async function createStudyPlan(prevState: FormState, formData: FormData): Promise<FormState> {
  const parsedFormData = formDataSchema.safeParse({
    subject: formData.get('subject'),
    deadline: formData.get('deadline'),
    sections: formData.getAll('sections'),
    studyMethods: formData.getAll('studyMethods'),
    frequency: formData.get('frequency'),
    duration: formData.get('duration'),
    userId: formData.get('userId'),
  });

  if (!parsedFormData.success) {
    const errorMessages = parsedFormData.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return {
      message: `Invalid form data: ${errorMessages}`,
      isError: true,
    };
  }

  const { subject, deadline, sections, studyMethods, frequency, duration, userId } = parsedFormData.data;

  if (!userId) {
    return {
        message: 'You must be logged in to create a study plan.',
        isError: true,
    };
  }

  try {
    const deadlineDate = new Date(deadline);

    const [scheduleResult, tipsResult] = await Promise.all([
      generateStudySchedule({
        subject,
        deadline: deadlineDate.toLocaleDateString(),
        sections: sections,
        studyMethods: studyMethods,
        frequency: parseInt(frequency),
        duration: parseInt(duration),
      }),
      provideAiStudyTips({
        subject,
        deadline: deadlineDate.toISOString().split('T')[0], // YYYY-MM-DD
        sections: sections.join(', '),
        studyMethods: studyMethods.join(', '),
      }),
    ]);

    // Return the data to the client to handle saving
    return {
      message: 'Successfully generated study plan!',
      studySchedule: scheduleResult.studySchedule,
      studyTips: tipsResult.studyTips,
      formData: parsedFormData.data,
      isError: false,
    };
  } catch (error) {
    console.error('Error creating study plan:', error);
    let errorMessage = 'Failed to generate study plan due to a server error.';
    if (error instanceof Error) {
        errorMessage = `Failed to generate study plan: ${error.message}`;
    }
    return {
      message: errorMessage,
      isError: true,
    };
  }
}
