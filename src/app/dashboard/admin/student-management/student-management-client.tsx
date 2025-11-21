
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const studentActions = [
    {
        title: "Add New Student",
        description: "Enroll a new student into the school system.",
        href: "/dashboard/admin/student-management/add"
    },
    {
        title: "Bulk Import Students",
        description: "Import student data from a CSV file.",
        href: "#"
    },
    {
        title: "Admissions",
        description: "Manage new student registrations and enrollment workflows.",
        href: "#"
    },
    {
        title: "Student Directory",
        description: "Complete listing of all active and archived students.",
        href: "#"
    },
    {
        title: "Promotion Management",
        description: "Promote students to the next academic level.",
        href: "#"
    },
    {
        title: "ID Cards & Transfer Certificates",
        description: "Generate and issue student identification documents.",
        href: "#"
    }
];

export function StudentManagementClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentActions.map((action) => (
                <Card key={action.title} className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
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
