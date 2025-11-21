
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const teacherActions = [
    {
        title: "Teacher Directory",
        description: "View and manage all faculty records."
    },
    {
        title: "Assignments & Allocations",
        description: "Assign teachers to classes and subjects."
    }
];

export function TeacherManagementClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teacherActions.map((action) => (
                <Card key={action.title} className="glassmorphic">
                    <CardHeader>
                        <CardTitle>{action.title}</CardTitle>
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
