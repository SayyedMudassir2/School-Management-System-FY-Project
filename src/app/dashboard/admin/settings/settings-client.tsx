
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Mail, MessageCircle, Server } from "lucide-react";

const systemSettings = [
    {
        title: "Backup & Restore",
        description: "Perform manual backups or schedule automated data backups. Restore from a previous point if needed.",
        icon: Database,
    },
    {
        title: "SMS Gateway Settings",
        description: "Configure your SMS provider to send alerts and notifications to students, parents, and staff.",
        icon: MessageCircle,
    },
    {
        title: "Email Gateway Settings",
        description: "Set up your email service for sending official school communications, reports, and newsletters.",
        icon: Mail,
    },
    {
        title: "System & Server",
        description: "View system status, server health, and manage application-level configurations.",
        icon: Server,
    }
];

export function SettingsClient() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemSettings.map((setting) => (
                <Card key={setting.title} className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <setting.icon className="h-6 w-6 text-primary" />
                            {setting.title}
                        </CardTitle>
                        <CardDescription>{setting.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline">
                            Configure
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
