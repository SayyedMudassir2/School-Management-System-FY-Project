
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
import { PageHeader } from "./components/page-header";
import { Users, BookOpen, Banknote, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AttendanceChart } from "./components/attendance-chart";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Welcome, Administrator" description="Here's a summary of your school's activities." />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground">-0.5% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54,231.89</div>
            <p className="text-xs text-muted-foreground">78% of target</p>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Science Fair next week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 mt-6">
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
