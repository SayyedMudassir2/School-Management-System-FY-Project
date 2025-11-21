
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "../components/page-header";
import { Users, BookOpen, Banknote, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AttendanceChart } from "../components/attendance-chart";
import { DashboardFilter } from "../components/dashboard-filter";

const dashboardData = {
    'this-week': {
        totalStudents: '1,254',
        totalStudentsChange: '+5.2% from last week',
        overallAttendance: '92.8%',
        overallAttendanceChange: '-0.5% from yesterday',
        feesCollected: '$54,231.89',
        feesCollectedChange: '78% of weekly target',
        upcomingEvents: '5',
        upcomingEventsChange: 'Science Fair next week'
    },
    'this-month': {
        totalStudents: '1,268',
        totalStudentsChange: '+1.8% from last month',
        overallAttendance: '93.5%',
        overallAttendanceChange: '+0.2% from last month',
        feesCollected: '$215,890.12',
        feesCollectedChange: '85% of monthly target',
        upcomingEvents: '12',
        upcomingEventsChange: 'Includes sports day'
    },
    'this-quarter': {
        totalStudents: '1,280',
        totalStudentsChange: '+3% from last quarter',
        overallAttendance: '94.1%',
        overallAttendanceChange: '+0.8% from last quarter',
        feesCollected: '$650,123.45',
        feesCollectedChange: '92% of quarterly target',
        upcomingEvents: '25',
        upcomingEventsChange: 'Parent-teacher meetings'
    },
    'this-year': {
        totalStudents: '1,300',
        totalStudentsChange: '+10% from last year',
        overallAttendance: '95.2%',
        overallAttendanceChange: '+1.5% from last year',
        feesCollected: '$2,500,000.00',
        feesCollectedChange: '98% of yearly target',
        upcomingEvents: '48',
        upcomingEventsChange: 'Annual day preparations'
    }
};


export function AdminDashboardClient() {
    const [filter, setFilter] = useState<keyof typeof dashboardData>('this-week');
    const data = dashboardData[filter];

  return (
    <>
      <PageHeader title="Welcome, Administrator!" description="Here's a summary of your school's activities.">
        <DashboardFilter value={filter} onValueChange={(value) => setFilter(value as keyof typeof dashboardData)} />
      </PageHeader>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground">{data.totalStudentsChange}</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overallAttendance}</div>
            <p className="text-xs text-muted-foreground">{data.overallAttendanceChange}</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.feesCollected}</div>
            <p className="text-xs text-muted-foreground">{data.feesCollectedChange}</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">{data.upcomingEventsChange}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 glassmorphic">
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>
              Here's an overview of student attendance for the current week.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AttendanceChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 glassmorphic">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>
              Here are the latest updates and news for the school community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableBody>
                    <TableRow className="border-none">
                        <TableCell className="p-2">
                            <p className="font-medium">Parent-Teacher Meeting</p>
                            <p className="text-xs text-muted-foreground">This is scheduled for next Friday.</p>
                        </TableCell>
                        <TableCell className="p-2 text-right">
                           <Badge variant="secondary">General</Badge>
                        </TableCell>
                    </TableRow>
                     <TableRow className="border-none">
                        <TableCell className="p-2">
                            <p className="font-medium">Annual Sports Day</p>
                            <p className="text-xs text-muted-foreground">Registrations are now open.</p>
                        </TableCell>
                        <TableCell className="p-2 text-right">
                           <Badge variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">Event</Badge>
                        </TableCell>
                    </TableRow>
                     <TableRow className="border-none">
                        <TableCell className="p-2">
                            <p className="font-medium">Library Renovation</p>
                            <p className="text-xs text-muted-foreground">The library will be closed this weekend.</p>
                        </TableCell>
                        <TableCell className="p-2 text-right">
                           <Badge variant="secondary">Notice</Badge>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
