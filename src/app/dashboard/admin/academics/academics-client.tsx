
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Library, BookCopy, ClipboardCheck, NotebookText } from "lucide-react";
import Link from "next/link";

const academicActions = [
    {
        title: "Classes, Subjects & Timetable",
        description: "Manage classes, sections, subjects, and weekly schedules.",
        icon: Library,
        href: "/dashboard/admin/setup",
    },
    {
        title: "Syllabus / Lesson Plan",
        description: "Track syllabus progress and manage curriculum details.",
        icon: BookCopy,
        href: "/dashboard/admin/syllabus",
    },
    {
        title: "Assignments / Homework",
        description: "Create, distribute, and track student assignments.",
        icon: ClipboardCheck,
        href: "/dashboard/admin/assignments",
    },
    {
        title: "Examinations",
        description: "Manage exam schedules, marks entry, and report cards.",
        icon: NotebookText,
        href: "/dashboard/admin/academics/exams",
    }
];

export function AcademicsClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {academicActions.map((action) => (
                <Card key={action.title} className="glassmorphic flex flex-col">
                    <CardHeader className="flex-grow">
                        <CardTitle className="flex items-center gap-3">
                            <action.icon className="h-6 w-6 text-primary" />
                            {action.title}
                        </CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild>
                            <Link href={action.href}>
                                Manage <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
