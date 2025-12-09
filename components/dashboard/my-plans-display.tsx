'use client';

import type { StudySession } from '@/lib/types'; // Updated type
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

type MyPlansDisplayProps = {
  plans: StudySession[];
};

export function MyPlansDisplay({ plans }: MyPlansDisplayProps) {
  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {plans.map((plan) => (
        <AccordionItem value={plan.id} key={plan.id} className="border-b-0">
            <div className="bg-card rounded-lg shadow-md border">
          <AccordionTrigger className="p-6 text-lg hover:no-underline">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left">
              <span className="font-headline font-semibold">{plan.subject}</span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Due: {format(new Date(plan.deadline.seconds * 1000), 'PPP')}
                </Badge>
                {plan.createdAt && (
                     <Badge variant="outline">
                        Created: {format(new Date(plan.createdAt.seconds * 1000), 'PP')}
                    </Badge>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                    <h3 className="font-semibold mb-2">Study Schedule</h3>
                    <ScrollArea className="h-72 w-full rounded-md border p-4 bg-secondary/30">
                        <pre className="whitespace-pre-wrap text-sm font-sans">{plan.studySchedule}</pre>
                    </ScrollArea>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">AI Study Tips</h3>
                    <ScrollArea className="h-72 w-full rounded-md border p-4 bg-secondary/30">
                         <div className="text-sm prose dark:prose-invert max-w-none">
                            {plan.aiTips.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
          </AccordionContent>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
