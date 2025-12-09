'use client';

import { useEffect, useActionState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createStudyPlan, type FormState } from '@/lib/actions';
import { StudyPlanForm } from './study-plan-form';
import { StudyScheduleDisplay } from './study-schedule-display';
import { StudyTipsDisplay } from './study-tips-display';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const initialState: FormState = {
  message: '',
  isError: false,
};

export function StudyPlanCreator() {
  const [state, formAction, isPending] = useActionState(createStudyPlan, initialState);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSaving, startSavingTransition] = useTransition();

  useEffect(() => {
    if (!isPending && state) {
      if (state.isError) {
        toast({
          variant: 'destructive',
          title: 'Oops! Something went wrong.',
          description: state.message,
        });
      } else if (state.studySchedule && state.studyTips && user && firestore) {
        // AI generation was successful, now save to Firestore
        startSavingTransition(async () => {
          try {
            await addDoc(collection(firestore, 'users', user.uid, 'studySessions'), {
              userId: user.uid,
              subject: state.formData?.subject,
              deadline: new Date(state.formData!.deadline),
              sections: state.formData?.sections,
              studyMethods: state.formData?.studyMethods,
              frequency: parseInt(state.formData!.frequency),
              duration: parseInt(state.formData!.duration),
              studySchedule: state.studySchedule,
              aiTips: state.studyTips,
              createdAt: serverTimestamp(),
            });

            toast({
              title: 'Success!',
              description: 'Your study plan has been generated and saved.',
            });
          } catch (error) {
            console.error('Failed to save study plan:', error);
            toast({
              variant: 'destructive',
              title: 'Save Failed',
              description: 'Your plan was generated but could not be saved. Please try again.',
            });
          }
        });
      }
    }
  }, [state, isPending, toast, user, firestore]);

  const isProcessing = isPending || isSaving;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
            <StudyPlanForm formAction={formAction} userId={user?.uid} isPending={isProcessing} />
        </Card>
      
      {state.studySchedule || state.studyTips ? (
        <div className="space-y-8">
            {state.studySchedule && <StudyScheduleDisplay schedule={state.studySchedule} />}
            {state.studyTips && <StudyTipsDisplay tips={state.studyTips} />}
        </div>
      ) : (
        <Card className="shadow-lg flex items-center justify-center min-h-[400px] bg-muted/30 border-dashed">
            {isProcessing ? (
                <FormLoader isSaving={isSaving} />
            ) : (
                <div className="text-center text-muted-foreground">
                    <p>Your generated plan will appear here.</p>
                </div>
            )}
        </Card>
      )}
    </div>
  );
}

export function FormLoader({ isSaving }: { isSaving?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-medium">{isSaving ? 'Saving your plan...' : 'Generating your plan...'}</span>
        </div>
    </div>
  )
}
