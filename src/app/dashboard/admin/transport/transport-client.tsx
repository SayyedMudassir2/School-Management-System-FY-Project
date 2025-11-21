
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Bus, MapPin, DollarSign } from "lucide-react";

const transportActions = [
    {
        title: "Routes & Stops",
        description: "Define bus routes and manage all pickup/drop-off points.",
        icon: Map,
    },
    {
        title: "Vehicle Management",
        description: "Maintain records of all school vehicles and their assignments.",
        icon: Bus,
    },
    {
        title: "Live Tracking",
        description: "Monitor vehicle locations and status in real-time.",
        icon: MapPin,
    },
    {
        title: "Transport Fees",
        description: "Manage fee collection for transportation services.",
        icon: DollarSign,
    }
];

export function TransportClient() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transportActions.map((action) => (
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
