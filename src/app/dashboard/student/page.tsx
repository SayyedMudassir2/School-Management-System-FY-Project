
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
  } from "@/components/ui/card";
import { PageHeader } from "../components/page-header";
import { 
    BookOpen, 
    CalendarCheck, 
    ClipboardCheck, 
    Trophy, 
    Clock, 
    Bell,
    DollarSign,
    ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const timetable = [
    { time: "09:00", subject: "Mathematics", teacher: "Mr. Taylor" },
    { time: "10:00", subject: "Physics", teacher: "Ms. Curie" },
    { time: "11:00", subject: "Break" },
    { time: "12:00", subject: "History", teacher: "Mr. Attenborough" },
];

const assignments = [
    { title: "Algebra Worksheet", subject: "Mathematics", due: "Tomorrow" },
    { title: "Lab Report: Photosynthesis", subject: "Biology", due: "In 3 days" },
    { title: "Essay on the Cold War", subject: "History", due: "Next Week" },
];

const announcements = [
    { title: "Annual Sports Day on Friday", time: "2h ago" },
    { title: "Library will be closed for maintenance", time: "1d ago" },
];

const exams = [
    { subject: "Chemistry", type: "Unit Test", date: "2 days" },
    { subject: "English Literature", type: "Mid-Term", date: "10 days" },
];

export default function StudentDashboardPage() {
    const attendancePercentage = 95;
    const feeDue = 250;

    return (
        <>
        <PageHeader title="Welcome, John!" description="Here is your academic overview for today." />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glassmorphic lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Today's Timetable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {timetable.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                            <p className="text-sm font-semibold text-muted-foreground w-16">{item.time}</p>
                            <div className="h-10 w-1 bg-border rounded-full" />
                            <div>
                                <p className="font-semibold">{item.subject}</p>
                                {item.teacher && <p className="text-xs text-muted-foreground">{item.teacher}</p>}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-primary"/>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     {assignments.map((item, index) => (
                        <div key={index} className="text-sm">
                            <div className="flex justify-between">
                                <p className="font-medium">{item.title}</p>
                                <Badge variant="secondary">{item.due}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{item.subject}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     {announcements.map((item, index) => (
                        <div key={index} className="text-sm">
                            <p className="font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary"/>Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-4xl font-bold">{attendancePercentage}%</span>
                        <span className="text-muted-foreground text-sm">Overall</span>
                    </div>
                    <Progress value={attendancePercentage} />
                </CardContent>
            </Card>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/>Upcoming Exams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {exams.map((exam, i) => (
                        <div key={i} className="text-sm flex justify-between">
                            <p>{exam.subject} <span className="text-muted-foreground">({exam.type})</span></p>
                            <p className="font-semibold">in {exam.date}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            {feeDue > 0 && (
                <Card className="glassmorphic border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><DollarSign className="h-5 w-5"/>Fee Reminder</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">${feeDue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">due next week.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="destructive" size="sm">Pay Now</Button>
                    </CardFooter>
                </Card>
            )}
            
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-primary"/>Recent Grades</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-baseline text-center">
                    <div>
                        <p className="text-3xl font-bold">A-</p>
                        <p className="text-xs text-muted-foreground">Mathematics</p>
                    </div>
                    <Separator orientation="vertical" className="h-10" />
                     <div>
                        <p className="text-3xl font-bold">B+</p>
                        <p className="text-xs text-muted-foreground">Physics</p>
                    </div>
                </CardContent>
            </Card>
        </div>
        </>
    );
}
