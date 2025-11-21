
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Library, NotebookText, Calendar, BookCopy, ClipboardCheck } from "lucide-react";

const academicActions = [
    {
        title: "Classes & Sections",
        description: "Manage classes and their respective sections (e.g., Class 10-A, 10-B).",
        icon: Library,
    },
    {
        title: "Subjects Management",
        description: "Define and manage all subjects offered by the school.",
        icon: NotebookText,
    },
    {
        title: "Class Routine / Timetable",
        description: "Create and manage weekly schedules for all classes.",
        icon: Calendar,
    },
    {
        title: "Syllabus / Lesson Plan",
        description: "Track syllabus progress and manage curriculum details.",
        icon: BookCopy,
    },
    {
        title: "Assignments / Homework",
        description: "Create, distribute, and track student assignments.",
        icon: ClipboardCheck,
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
