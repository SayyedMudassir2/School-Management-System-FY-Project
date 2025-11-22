
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Users, Upload, BookUser } from "lucide-react";
import Link from "next/link";

const teacherActions = [
    {
        title: "Teacher/Staff List",
        description: "View, edit, and manage all faculty and staff records.",
        icon: Users,
        href: "/dashboard/admin/teacher-management/list"
    },
    {
        title: "Add New Teacher/Staff",
        description: "Onboard a new faculty or staff member.",
        icon: UserPlus,
        href: "/dashboard/admin/teacher-management/add"
    },
    {
        title: "Bulk Import Staff",
        description: "Import staff data from a CSV file for quick setup.",
        icon: Upload,
        href: "/dashboard/admin/teacher-management/bulk-import"
    },
    {
        title: "Assign Class Teacher / Subjects",
        description: "Allocate teachers to classes and assign subjects.",
        icon: BookUser,
        href: "/dashboard/admin/teacher-management/assign"
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

    
