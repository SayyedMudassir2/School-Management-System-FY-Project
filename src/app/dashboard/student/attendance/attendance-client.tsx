'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eachDayOfInterval, endOfMonth, format, getDaysInMonth, startOfMonth } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const mockSubjectAttendance = [
    { subject: 'Mathematics', total: 30, present: 29 },
    { subject: 'Physics', total: 28, present: 27 },
    { subject: 'Chemistry', total: 29, present: 29 },
    { subject: 'Biology', total: 27, present: 25 },
    { subject: 'English', total: 30, present: 30 },
    { subject: 'History', total: 26, present: 24 },
];

const mockCalendarData: Record<string, 'present' | 'absent'> = {
    '2024-07-01': 'present',
    '2024-07-02': 'present',
    '2024-07-03': 'absent',
    '2024-07-04': 'present',
    '2024-07-05': 'present',
    '2024-07-08': 'present',
    '2024-07-09': 'present',
    '2024-07-10': 'present',
    '2024-07-11': 'present',
    '2024-07-12': 'absent',
    '2024-07-15': 'present',
    '2024-07-16': 'present',
};

export function AttendanceClient() {
    const [month, setMonth] = useState(new Date());

    const summary = useMemo(() => {
        const total = mockSubjectAttendance.reduce((acc, sub) => acc + sub.total, 0);
        const present = mockSubjectAttendance.reduce((acc, sub) => acc + sub.present, 0);
        return {
            total,
            present,
            absent: total - present,
            percentage: total > 0 ? (present / total) * 100 : 0
        };
    }, []);

    const modifiers = {
        present: (date: Date) => mockCalendarData[format(date, 'yyyy-MM-dd')] === 'present',
        absent: (date: Date) => mockCalendarData[format(date, 'yyyy-MM-dd')] === 'absent',
    };
    
    const modifiersStyles = {
        present: {
            borderColor: 'hsl(var(--primary))',
            borderWidth: '2px',
        },
        absent: {
            borderColor: 'hsl(var(--destructive))',
            borderWidth: '2px',
        },
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glassmorphic">
                    <CardHeader><CardTitle>Total Attendance</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between">
                            <p className="text-5xl font-bold">{summary.percentage.toFixed(1)}%</p>
                            <p className="text-muted-foreground">{summary.present}/{summary.total} days</p>
                        </div>
                        <Progress value={summary.percentage} className="mt-2"/>
                    </CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader><CardTitle>Present</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold text-green-500">{summary.present}</p></CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader><CardTitle>Absent</CardTitle></CardHeader>
                    <CardContent><p className="text-5xl font-bold text-destructive">{summary.absent}</p></CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Subject-wise Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Total Classes</TableHead><TableHead>Attended</TableHead><TableHead>Percentage</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {mockSubjectAttendance.map(item => (
                                        <TableRow key={item.subject}>
                                            <TableCell className="font-medium">{item.subject}</TableCell>
                                            <TableCell>{item.total}</TableCell>
                                            <TableCell>{item.present}</TableCell>
                                            <TableCell><Badge variant={(item.present / item.total) * 100 < 75 ? 'destructive' : 'default'}>{((item.present / item.total) * 100).toFixed(1)}%</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle>Calendar View</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <Input type="month" value={format(month, 'yyyy-MM')} onChange={e => setMonth(new Date(e.target.value))} className="w-full mb-4" />
                            <Calendar
                                mode="single"
                                month={month}
                                onMonthChange={setMonth}
                                modifiers={modifiers}
                                modifiersStyles={modifiersStyles}
                                className="rounded-md border p-0"
                            />
                             <div className="flex justify-around w-full mt-4 text-xs">
                                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border-2 border-primary"></div> Present</div>
                                <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full border-2 border-destructive"></div> Absent</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}