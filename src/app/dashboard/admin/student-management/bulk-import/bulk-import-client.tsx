
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BulkImportClient() {
    return (
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>
                    This section is under development. Soon, you'll be able to import student data in bulk using a CSV file.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Check back for updates!</p>
            </CardContent>
        </Card>
    );
}
