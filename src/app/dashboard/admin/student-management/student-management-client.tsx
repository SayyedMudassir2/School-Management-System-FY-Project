
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus, Upload, School, UserCircle, UserCheck, Award } from "lucide-react";
import Link from "next/link";

const studentActions = [
    {
        title: "Add New Student",
        description: "Enroll a new student into the school system.",
        href: "/dashboard/admin/student-management/add",
        icon: UserPlus,
    },
    {
        title: "Bulk Import Students",
        description: "Import student data from a CSV file.",
        href: "/dashboard/admin/student-management/bulk-import",
        icon: Upload,
    },
    {
        title: "Admissions",
        description: "Manage new student registrations and enrollment workflows.",
        href: "#",
        icon: School,
    },
    {
        title: "Student Directory",
        description: "Complete listing of all active and archived students.",
        href: "#",
        icon: UserCircle,
    },
    {
        title: "Promotion Management",
        description: "Promote students to the next academic level.",
        href: "#",
        icon: UserCheck,
    },
    {
        title: "ID Cards & Transfer Certificates",
        description: "Generate and issue student identification documents.",
        href: "#",
        icon: Award,
    }
];

export function StudentManagementClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentActions.map((action) => (
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
