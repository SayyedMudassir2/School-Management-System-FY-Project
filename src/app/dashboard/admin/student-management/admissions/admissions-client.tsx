
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdmissionsClient() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Admissions Management</CardTitle>
                <CardDescription>
                    This section is under development. Soon, you'll be able to manage the entire admissions workflow here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Check back for updates!</p>
            </CardContent>
        </Card>
    );
}
