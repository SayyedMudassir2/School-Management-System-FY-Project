
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { PageHeader } from "../components/page-header";
import { User, Calendar, MessageSquare, Banknote } from "lucide-react";
  
export default function ParentDashboardPage() {
    return (
        <>
        <PageHeader title="Welcome, Parent!" description="Here's a summary of your child's activities." />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Your Child's Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Alex Doe</div>
                <p className="text-xs text-muted-foreground">Class 10-A</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Present for all classes this week</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">2 New</div>
                <p className="text-xs text-muted-foreground">From teachers and admin</p>
            </CardContent>
            </Card>
            <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
                <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$250.00</div>
                <p className="text-xs text-muted-foreground">Due next week</p>
            </CardContent>
            </Card>
        </div>
        </>
    );
}
