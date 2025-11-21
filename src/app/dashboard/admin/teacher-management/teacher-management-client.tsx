'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Users, Upload, BookUser } from "lucide-react";

const teacherActions = [
    {
        title: "Teacher/Staff List",
        description: "View, edit, and manage all faculty and staff records.",
        icon: Users,
    },
    {
        title: "Add New Teacher/Staff",
        description: "Onboard a new faculty or staff member.",
        icon: UserPlus,
    },
    {
        title: "Bulk Import Staff",
        description: "Import staff data from a CSV file for quick setup.",
        icon: Upload,
    },
    {
        title: "Assign Class Teacher / Subjects",
        description: "Allocate teachers to classes and assign subjects.",
        icon: BookUser,
    }
];

export function TeacherManagementClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teacherActions.map((action) => (
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
