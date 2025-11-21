
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AssignmentsClient() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Assignment Management</CardTitle>
                <CardDescription>
                    This section is under development. Soon, you'll be able to manage assignments and homework for all classes here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Check back for updates!</p>
            </CardContent>
        </Card>
    );
}
