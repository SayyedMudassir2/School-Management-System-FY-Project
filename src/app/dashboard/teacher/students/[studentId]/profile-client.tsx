
'use client';

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StudentProfile } from "@/lib/mock-data";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { FileText, DollarSign, CalendarCheck, MessageSquare, FileUp } from "lucide-react";

type ProfileClientProps = {
  student: StudentProfile;
};

export function ProfileClient({ student }: ProfileClientProps) {
    const getStatusBadge = (status: StudentProfile['status']) => {
        switch(status) {
          case 'Active': return <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Active</Badge>;
          case 'Alumni': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/20">Alumni</Badge>;
          case 'Transferred': return <Badge variant="secondary" className="bg-orange-500/20 text-orange-700 border-orange-500/20">Transferred</Badge>;
          case 'Archived': return <Badge variant="destructive" className="bg-gray-500/20 text-gray-400 border-gray-500/20">Archived</Badge>;
          default: return <Badge>{status}</Badge>;
        }
    };
    
    const attendancePercentage = (student.attendance.present / student.attendance.total) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-8">
        <Card className="glassmorphic text-center">
            <CardContent className="p-6">
                <Avatar className="h-28 w-28 mx-auto mb-4 border-4 border-primary/50">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-muted-foreground">{student.email}</p>
                <div className="mt-2">{getStatusBadge(student.status)}</div>
            </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Class</span> <span className="font-medium">{student.class}-{student.section}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date of Birth</span> <span className="font-medium">{format(new Date(student.dateOfBirth), 'dd MMM, yyyy')}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Gender</span> <span className="font-medium">{student.gender}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Parent's Name</span> <span className="font-medium">{student.parentName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Parent's Contact</span> <span className="font-medium">{student.parentContact}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span> <span className="font-medium text-right">{student.address}</span></div>
          </CardContent>
        </Card>
         <Card className="glassmorphic">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Behavior Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">No behavior notes recorded.</p>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarCheck className="h-5 w-5 text-primary" /> Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-4xl font-bold">{attendancePercentage.toFixed(1)}%</span>
                        <span className="text-muted-foreground">{student.present}/{student.attendance.total} days</span>
                    </div>
                    <Progress value={attendancePercentage} />
                    <p className="text-xs text-muted-foreground mt-1">Overall attendance record.</p>
                </CardContent>
            </Card>
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileUp className="h-5 w-5 text-primary" /> Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">No documents uploaded.</p>
                    <Button variant="outline" size="sm">Upload Document</Button>
                </CardContent>
            </Card>
        </div>
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Academic History</CardTitle>
            <CardDescription>A record of the student's performance over the years.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.academicHistory.map((record) => (
                  <TableRow key={record.year}>
                    <TableCell>{record.year}</TableCell>
                    <TableCell>{record.class}</TableCell>
                    <TableCell>{record.percentage}%</TableCell>
                    <TableCell>{record.rank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
