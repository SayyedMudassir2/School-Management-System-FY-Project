
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AssignmentsClient() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>
                    This section provides an overview of assignments across all classes. For detailed management, please refer to the teacher dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The primary assignment management tools are available on the teacher's dashboard.</p>
                <Button asChild variant="link" className="px-0">
                    <Link href="/dashboard/teacher/assignments">Go to Teacher Assignments</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
