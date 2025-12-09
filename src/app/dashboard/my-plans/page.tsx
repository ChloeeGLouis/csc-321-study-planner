'use client';
import { collection, query, orderBy } from 'firebase/firestore';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { MyPlansDisplay } from '@/components/dashboard/my-plans-display';
import type { StudySession } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookCopy, Loader2 } from 'lucide-react';

export default function MyPlansPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const plansQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        // Correct path to the subcollection
        const plansRef = collection(firestore, 'users', user.uid, 'studySessions');
        return query(plansRef, orderBy('createdAt', 'desc'));
    }, [user, firestore]);

    const { data: plans, isLoading: arePlansLoading, error } = useCollection<StudySession>(plansQuery);

    if (isUserLoading || arePlansLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Could not load study plans. Please try again later.
                </AlertDescription>
            </Alert>
        )
    }
    
    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Study Plans</h1>
            <p className="text-muted-foreground mt-2">Review and manage your previously generated study plans.</p>
            <div className="mt-8">
                {plans && plans.length > 0 ? (
                    <MyPlansDisplay plans={plans} />
                ) : (
                    <Alert>
                        <BookCopy className="h-4 w-4" />
                        <AlertTitle>No Plans Yet!</AlertTitle>
                        <AlertDescription>
                            You haven't created any study plans. Go to the dashboard to generate your first one.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}
