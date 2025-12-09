import { StudyPlanCreator } from "@/components/dashboard/study-plan-creator";

export default function DashboardPage() {
    return (
        <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Create a New Study Plan</h1>
            <p className="text-muted-foreground mt-2">Fill in the details below and let our AI generate a personalized study plan for you.</p>
            <div className="mt-8">
                <StudyPlanCreator />
            </div>
        </div>
    );
}
