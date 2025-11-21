
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SyllabusClient() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Syllabus Management</CardTitle>
                <CardDescription>
                    This section is under development. Soon, you'll be able to manage the syllabus and lesson plans for all classes here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Check back for updates!</p>
            </CardContent>
        </Card>
    );
}
