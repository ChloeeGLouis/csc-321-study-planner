import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";
import ReactMarkdown from 'react-markdown';

type StudyTipsDisplayProps = {
  tips: string;
};

export function StudyTipsDisplay({ tips }: StudyTipsDisplayProps) {
  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">AI-Powered Study Tips</CardTitle>
        <CardDescription>Expert advice to help you study smarter.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4 bg-secondary/30">
            <div className="text-sm prose dark:prose-invert max-w-none">
              <ReactMarkdown>{tips}</ReactMarkdown>
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
