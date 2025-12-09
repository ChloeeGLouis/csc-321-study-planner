import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";

type StudyScheduleDisplayProps = {
  schedule: string;
};

export function StudyScheduleDisplay({ schedule }: StudyScheduleDisplayProps) {
  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="font-headline">Your Study Schedule</CardTitle>
        <CardDescription>Here is your personalized plan to success.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full rounded-md border p-4 bg-secondary/30">
          <pre className="whitespace-pre-wrap text-sm font-sans">{schedule}</pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
