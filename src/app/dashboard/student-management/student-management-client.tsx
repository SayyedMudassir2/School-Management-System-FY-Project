
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const studentActions = [
    {
        title: "Admissions",
        description: "Manage new student registrations and enrollment workflows."
    },
    {
        title: "Student Directory",
        description: "Complete listing of all active and archived students."
    },
    {
        title: "Promotion Management",
        description: "Promote students to the next academic level."
    },
    {
        title: "ID Cards & Transfer Certificates",
        description: "Generate and issue student identification documents."
    }
];

export function StudentManagementClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentActions.map((action) => (
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
