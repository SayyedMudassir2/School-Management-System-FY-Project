
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Bus, Users, Clock, IndianRupee, AlertTriangle, UserPlus, FileBarChart, MapPin, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const kpiData = [
    {
        title: "Active Routes",
        value: "18",
        description: "routes running today",
        icon: Map,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        title: "Total Vehicles",
        value: "24",
        description: "buses in the fleet",
        icon: Bus,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        title: "Students Using Transport",
        value: "1,248 / 2,850",
        description: "(44% of total students)",
        icon: Users,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        title: "Pending Transport Fees",
        value: "₹1,84,500",
        description: "due this month",
        icon: IndianRupee,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
];

const tripStatusData = [
    { route: "Route 12", status: "On Time", variant: "success" },
    { route: "Route 5", status: "15 min late", variant: "destructive" },
    { route: "Route 8", status: "Reached School", variant: "default" },
    { route: "Route 3", status: "On Time", variant: "success" },
    { route: "Route 15", status: "Started", variant: "secondary" },
];

const transportManagementLinks = [
    { title: "Routes & Stops", icon: Map, href: "/dashboard/admin/transport/routes" },
    { title: "Vehicle Management", icon: Bus, href: "/dashboard/admin/transport/vehicles" },
    { title: "Student Assignment", icon: UserPlus, href: "/dashboard/admin/transport/student-assignment" },
    { title: "Live Tracking & GPS", icon: MapPin, href: "/dashboard/admin/transport/live-tracking" },
    { title: "Transport Fees", icon: Wallet, href: "/dashboard/admin/transport/fees" },
    { title: "Reports & Registers", icon: FileBarChart, href: "#" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'On Time': return <Badge className="bg-green-500/20 text-green-700 border-green-500/20">On Time</Badge>;
        case '15 min late': return <Badge variant="destructive">15 min late</Badge>;
        case 'Reached School': return <Badge>Reached</Badge>;
        case 'Started': return <Badge variant="secondary">Started</Badge>;
        default: return <Badge>{status}</Badge>;
    }
}


export function TransportClient() {
  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((item) => (
                <Card key={item.title} className="glassmorphic">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <div className={`p-2 rounded-lg ${item.bgColor}`}>
                           <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Button variant="outline" size="lg" className="flex-col h-24">
                           <UserPlus className="h-6 w-6 mb-2" />
                           Assign Student
                        </Button>
                        <Button variant="outline" size="lg" className="flex-col h-24">
                           <IndianRupee className="h-6 w-6 mb-2" />
                           Collect Fee
                        </Button>
                         <Button variant="outline" size="lg" className="flex-col h-24">
                           <MapPin className="h-6 w-6 mb-2" />
                           View Live Map
                        </Button>
                    </CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Today's Trip Status</CardTitle>
                        <CardDescription>Real-time updates on all active routes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {tripStatusData.map((trip, index) => (
                            <div key={index} className={`flex items-center justify-between p-3 ${index < tripStatusData.length -1 ? 'border-b' : ''}`}>
                                <p className="font-medium">{trip.route}</p>
                                {getStatusBadge(trip.status)}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
            <div className="space-y-8">
                <Card className="glassmorphic border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                           <AlertTriangle className="h-5 w-5" /> Today’s Late Vehicles
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Bus No. 5</span>
                            <Badge variant="destructive">15 min late</Badge>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Transport Management</CardTitle>
                        <CardDescription>Configure all transport settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {transportManagementLinks.map(link => (
                             <Button key={link.title} variant="outline" className="w-full justify-start gap-2" asChild>
                                <Link href={link.href}>
                                    <link.icon className="h-4 w-4 md:hidden lg:inline-flex"/> {link.title}
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
