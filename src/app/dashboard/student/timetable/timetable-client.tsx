
'use client';

import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Printer, AlertCircle, Clock, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const todaySchedule = [
    { subject: "Mathematics", time: "09:00 - 10:00", teacher: "Mr. Taylor", room: "204" },
    { subject: "Physics", time: "10:15 - 11:00", teacher: "Ms. Curie", room: "301" },
    { subject: "Break", time: "11:00 - 11:45", teacher: "", room: "" },
    { subject: "History", time: "12:00 - 12:45", teacher: "Mr. Attenborough", room: "102" },
];

const weeklyTimetable = {
    "Monday": ["Mathematics", "Physics", "Break", "History", "Biology", "Chemistry", "English", "Art"],
    "Tuesday": ["Chemistry", "English", "History", "Break", "Mathematics", "Physics", "Biology", "Art"],
    "Wednesday": ["Biology", "Mathematics", "Break", "Physics", "English", "History", "Chemistry", "Art"],
    "Thursday": ["English", "History", "Break", "Chemistry", "Mathematics", "Physics", "Biology", "Art"],
    "Friday": ["Physics", "Chemistry", "Break", "Biology", "English", "History", "Mathematics", "Art"],
    "Saturday": ["Free", "Free", "Free", "Free", "Free", "Free", "Free", "Free"],
};

const subjectColors: { [key: string]: string } = {
    "Physics": "bg-blue-500/10 text-blue-800 border-blue-500/20",
    "Mathematics": "bg-green-500/10 text-green-800 border-green-500/20",
    "History": "bg-yellow-500/10 text-yellow-800 border-yellow-500/20",
    "Biology": "bg-teal-500/10 text-teal-800 border-teal-500/20",
    "Chemistry": "bg-purple-500/10 text-purple-800 border-purple-500/20",
    "English": "bg-red-500/10 text-red-800 border-red-500/20",
    "Art": "bg-pink-500/10 text-pink-800 border-pink-500/20",
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
                                            <p className="font-semibold">{item.subject}</p>
                                            <p className="text-xs text-muted-foreground">{item.time}{item.teacher && ` | ${item.teacher}`}{item.room && ` | Room ${item.room}`}</p>
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

