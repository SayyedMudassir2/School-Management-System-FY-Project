
'use client';

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Printer, AlertCircle, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const todaySchedule = [
    { subject: "Physics", time: "10:15 - 11:00", class: "10-A", room: "301" },
    { subject: "Mathematics", time: "11:00 - 11:45", class: "9-B", room: "204" },
    { subject: "Physics", time: "12:30 - 13:15", class: "10-B", room: "302" },
];

const weeklyTimetable = {
    "Monday": ["Physics (10A)", "Mathematics (9B)", "Break", "Physics (10B)", "Free", "Free", "Free", "Free"],
    "Tuesday": ["Mathematics (9A)", "Physics (10A)", "Physics (10B)", "Break", "Mathematics (9B)", "Free", "Free", "Free"],
    "Wednesday": ["Physics (10B)", "Mathematics (9A)", "Break", "Physics (10A)", "Mathematics (9B)", "Free", "Free", "Free"],
    "Thursday": ["Mathematics (9B)", "Physics (10B)", "Break", "Physics (10A)", "Free", "Free", "Free", "Free"],
    "Friday": ["Physics (10A)", "Mathematics (9A)", "Break", "Mathematics (9B)", "Physics (10B)", "Free", "Free", "Free"],
    "Saturday": ["Free", "Free", "Free", "Free", "Free", "Free", "Free", "Free"],
};

const alerts = [
    { type: "Substitute", message: "You have been assigned as a substitute for English in Class 8-A for Period 2 today." },
    { type: "Room Change", message: "Your Physics class for 10-A (Period 1, Monday) has been moved to Room 405." },
];

const subjectColors: { [key: string]: string } = {
    "Physics": "bg-blue-500/10 text-blue-800 border-blue-500/20",
    "Mathematics": "bg-green-500/10 text-green-800 border-green-500/20",
    "Break": "bg-gray-500/10 text-gray-800 border-gray-500/20",
    "Free": "bg-transparent",
};


export function TimetableClient() {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <div ref={printRef} className="printable-area space-y-8">
                <div className="non-printable mb-8">
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Today's Alerts</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5">
                            {alerts.map((alert, index) => (
                                <li key={index}><strong>{alert.type}:</strong> {alert.message}</li>
                            ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Today's Schedule</CardTitle>
                                <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {todaySchedule.map((item, index) => (
                                    <div key={index} className="flex items-center p-3 rounded-lg bg-secondary/50">
                                         <div className="ml-4 flex-1">
                                            <p className="font-semibold">{item.subject} <span className="text-sm font-normal text-muted-foreground">({item.class})</span></p>
                                            <p className="text-xs text-muted-foreground">{item.time} | Room: {item.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2">
                        <Card className="glassmorphic">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Weekly Timetable</CardTitle>
                                     <Button variant="outline" size="sm" onClick={handlePrint} className="non-printable">
                                        <Printer className="mr-2 h-4 w-4"/> Print
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Day</TableHead>
                                            {[...Array(8)].map((_, i) => <TableHead key={i}>P {i + 1}</TableHead>)}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(weeklyTimetable).map(([day, periods]) => (
                                            <TableRow key={day}>
                                                <TableCell className="font-medium">{day}</TableCell>
                                                {periods.map((period, index) => {
                                                    const subject = period.split(' ')[0];
                                                    const colorClass = subjectColors[subject] || 'bg-background';
                                                    return (
                                                        <TableCell key={index}>
                                                            <div className={cn("p-2 rounded-md text-xs text-center", colorClass)}>
                                                                {period}
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                    }
                    .non-printable {
                        display: none;
                    }
                    .printable-area {
                        padding: 1rem;
                    }
                    .glassmorphic {
                        background: white !important;
                        border: 1px solid #ccc !important;
                        backdrop-filter: none !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </>
    );
}
