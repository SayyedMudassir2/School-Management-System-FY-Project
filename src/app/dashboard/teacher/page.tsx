
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
  } from "@/components/ui/card";
import { PageHeader } from "../components/page-header";
import { BookCopy, Users, ClipboardCheck, Bell, Clock, Calendar, CheckSquare, FilePen, Upload, BadgePercent, Cake, UserCheck, ArrowRight, BookUp, FilePlus, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

  const timetable = [
    { period: 3, subject: "Physics", class: "10-A", time: "10:15 - 11:00", room: "301" },
    { period: 4, subject: "Mathematics", class: "9-B", time: "11:00 - 11:45", room: "204" },
    { period: 5, subject: "Physics", class: "10-B", time: "12:30 - 13:15", room: "302" },
  ];

  const quickAttendance = [
    { class: "10-A", subject: "Physics" },
    { class: "9-B", subject: "Mathematics" },
  ];

  const announcements = [
    { id: 1, title: "Staff Meeting on Friday", time: "2h ago" },
    { id: 2, title: "Science Fair Registrations Open", time: "1d ago" },
    { id: 3, title: "Submit exam papers by EOD", time: "2d ago" },
  ];

  const birthdays = [
    { name: "Alice Johnson", class: "10-A", day: "Today" },
    { name: "David Miller", class: "9-B", day: "Tomorrow" },
  ]
  
  const quickActions = [
      { title: "Take Attendance", icon: UserCheck, href: "#"},
      { title: "Create Assignment", icon: FilePlus, href: "/dashboard/admin/assignments"},
      { title: "Upload Study Material", icon: BookUp, href: "#"},
      { title: "Enter Marks", icon: NotebookPen, href: "#"},
  ]

export default function TeacherDashboardPage() {
    return (
        <>
        <PageHeader title="Welcome, Teacher!" description="Here's what's happening today." />
        
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Today's Timetable */}
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/> Today's Timetable</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timetable.map(item => (
                                    <div key={item.period} className="flex items-center">
                                        <div className="flex flex-col items-center justify-center h-12 w-12 rounded-lg bg-primary/10 text-primary">
                                            <span className="text-xs">Period</span>
                                            <span className="font-bold text-lg">{item.period}</span>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold">{item.subject} <span className="text-sm font-normal text-muted-foreground">({item.class})</span></p>
                                            <p className="text-xs text-muted-foreground">{item.time} | Room: {item.room}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Attendance */}
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary"/> Quick Attendance</CardTitle>
                            <CardDescription>Mark today's attendance.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {quickAttendance.map(item => (
                                <div key={item.class} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                                    <div>
                                        <p className="font-semibold">Class {item.class}</p>
                                        <p className="text-xs text-muted-foreground">{item.subject}</p>
                                    </div>
                                    <Button size="sm">Mark Attendance</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                     {/* Pending Assignments */}
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FilePen className="h-5 w-5 text-primary"/> Pending Assignments</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex justify-between items-center">
                                <p>Submissions to check</p>
                                <Badge variant="destructive">12</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <p>Assignments to grade</p>
                                <Badge variant="secondary">5</Badge>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full">View All</Button>
                        </CardFooter>
                    </Card>

                     {/* Upcoming Exams */}
                    <Card className="glassmorphic">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ClipboardCheck className="h-5 w-5 text-primary"/> Upcoming Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">Physics Mid-term on {new Date(new Date().setDate(new Date().getDate() + 3)).toLocaleDateString()}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="glassmorphic">
                    <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map(action => (
                             <Button key={action.title} variant="outline" className="h-24 flex-col gap-2" asChild>
                                <Link href={action.href}>
                                    <action.icon className="h-6 w-6 text-primary" />
                                    <span>{action.title}</span>
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1 space-y-6">
                {/* Announcements */}
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-primary"/> Recent Announcements</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="space-y-4">
                            {announcements.map((item, index) => (
                                <div key={item.id} className={`flex items-start gap-4 ${index < announcements.length - 1 ? 'pb-4 border-b border-border/50' : ''}`}>
                                    <div className="text-sm">
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.time}</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0"/>
                                </div>
                            ))}
                       </div>
                    </CardContent>
                </Card>

                {/* Birthday Reminder */}
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Cake className="h-5 w-5 text-primary"/> Birthday Reminders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {birthdays.map(b => (
                             <div key={b.name} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">{b.name}</p>
                                    <p className="text-xs text-muted-foreground">{b.class}</p>
                                </div>
                                <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20">{b.day}</Badge>
                            </div>
                         ))}
                    </CardContent>
                </Card>

                {/* Leave Summary */}
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Leave Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <p>Pending leave requests</p>
                            <span className="font-bold">1</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Total leaves used (this year)</p>
                            <span className="font-bold">4 / 12</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        </>
    );
}
