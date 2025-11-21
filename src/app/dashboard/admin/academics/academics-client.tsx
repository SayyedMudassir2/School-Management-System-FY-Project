
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookCheck, ClipboardList, NotebookText } from "lucide-react";

const academicActions = [
    {
        title: "Manage Examinations",
        description: "Schedule exams, create papers, and manage results.",
        icon: ClipboardList,
    },
    {
        title: "Grading & Reports",
        description: "Define grading systems and generate student report cards.",
        icon: BookCheck,
    },
    {
        title: "Syllabus & Curriculum",
        description: "Track syllabus progress and manage curriculum details.",
        icon: NotebookText,
    }
];

export function AcademicsClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicActions.map((action) => (
                <Card key={action.title} className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <action.icon className="h-6 w-6 text-primary" />
                            {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">
                            Manage <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
