
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { PageHeader } from "../components/page-header";
import { BookCopy, Users, ClipboardCheck, Bell } from "lucide-react";
  
export default function TeacherDashboardPage() {
    return (
        <>
        <PageHeader title="Welcome, Teacher!" description="Here's a summary of your classes and activities." />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                <BookCopy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Classes assigned this semester</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">112</div>
                <p className="text-xs text-muted-foreground">Across all your classes</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Assignments to grade</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3 New</div>
                <p className="text-xs text-muted-foreground">Submissions from students</p>
            </CardContent>
            </Card>
        </div>
        </>
    );
}
