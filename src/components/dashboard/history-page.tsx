
'use client';

import { useUser, useFirestore } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { StudyScheduleDisplay } from './study-schedule-display';
import { StudyTipsDisplay } from './study-tips-display';

// Define the type for a study session
interface StudySession {
  id: string;
  subject: string;
  deadline: { seconds: number; nanoseconds: number };
  sections: string[];
  studyMethods: string[];
  frequency: number;
  duration: number;
  studySchedule: any; // Define a more specific type if possible
  aiTips: any; // Define a more specific type if possible
  createdAt: { seconds: number; nanoseconds: number };
}

export function HistoryPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [history, setHistory] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      if (user && firestore) {
        try {
          const q = query(
            collection(firestore, 'users', user.uid, 'studySessions'),
            orderBy('createdAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const sessions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as StudySession[];
          setHistory(sessions);
        } catch (error) {
          console.error('Error fetching history:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [user, firestore]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2 text-primary">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading history...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Authentication Required</CardTitle>
                <CardDescription>
                Please log in to view your study plan history.
                </CardDescription>
            </CardHeader>
        </Card>
    )
  }

  if (history.length === 0) {
    return (
        <Card>
        <CardHeader>
            <CardTitle>No History Found</CardTitle>
            <CardDescription>
            You haven't created any study plans yet. Create one to get started!
            </CardDescription>
        </CardHeader>
    </Card>
    );
  }

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  };


  return (
    <div className="animate-fade-in-up space-y-4">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Study Plan History</h1>
      <p className="text-muted-foreground">Review your previously generated study plans.</p>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {history.map((session) => (
          <AccordionItem value={session.id} key={session.id}>
            <AccordionTrigger className="p-4 bg-muted/50 rounded-lg">
                <div className="flex flex-col text-left">
                    <span className="font-semibold">{session.subject}</span>
                    <span className="text-sm text-muted-foreground">
                        Created on {formatDate(session.createdAt)}
                    </span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="p-4 border rounded-b-lg">
              <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold">Original Request</h3>
                    <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                        <li><strong>Deadline:</strong> {new Date(session.deadline.seconds * 1000).toLocaleDateString()}</li>
                        <li><strong>Sections:</strong> {session.sections.join(', ')}</li>
                        <li><strong>Study Methods:</strong> {session.studyMethods.join(', ')}</li>
                        <li><strong>Frequency:</strong> {session.frequency} times a week</li>
                        <li><strong>Duration:</strong> {session.duration} hours per session</li>
                    </ul>
                </div>
                {session.studySchedule && <StudyScheduleDisplay schedule={session.studySchedule} />}
                {session.aiTips && <StudyTipsDisplay tips={session.aiTips} />}
                <div className="flex justify-end">
                    <Button variant="outline" size="sm">
                        Re-use Plan
                    </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
