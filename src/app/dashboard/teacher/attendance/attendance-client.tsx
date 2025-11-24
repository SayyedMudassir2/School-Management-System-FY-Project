
"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAttendanceInsights, type AttendanceInsightsOutput } from "@/ai/flows/attendance-insights";
import { mockAttendanceRecords, studentDirectory as allStudentsData } from "@/lib/mock-data";
import { Rocket, FileText, UserX, Lightbulb, Check, X, Calendar as CalendarIcon, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

type Class = { id: string; name: string };
type Student = { id: string; name: string; avatar: string; admissionNo: string; classId?: string };

type AttendanceClientProps = {
  classes: Class[];
  students: Student[];
};

type AttendanceStatus = { [studentId: string]: 'present' | 'absent' };

export function AttendanceClient({ classes, students: initialStudents }: AttendanceClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [insights, setInsights] = useState<AttendanceInsightsOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const studentMap = new Map(initialStudents.map(s => [s.id, s.name]));

  // State for marking attendance
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({});
  
  const studentsInClass = useMemo(() => {
    return allStudentsData
      .filter(s => s.class === selectedClass.replace('Class ', '').split('-')[0] && s.status === 'Active')
      .map(s => ({...s, classId: selectedClass}));
  }, [selectedClass]);

  // Effect to initialize attendance when class or date changes
  useEffect(() => {
    const newStatus: AttendanceStatus = {};
    studentsInClass.forEach(student => {
      newStatus[student.id] = 'present';
    });
    setAttendanceStatus(newStatus);
  }, [selectedClass, attendanceDate, studentsInClass]);

  const handleGenerate = async () => {
    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setInsights(null);

    try {
      const result = await getAttendanceInsights({
        attendanceRecords: mockAttendanceRecords,
        classDetails: `Class: ${selectedClass}`,
      });
      setInsights(result);
    } catch (e) {
      setError("Failed to generate insights.  Please try again.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusChange = (studentId: string, status: 'present' | 'absent') => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handlePresentAllToggle = (checked: boolean) => {
    const newStatus: AttendanceStatus = {};
    studentsInClass.forEach(student => {
        newStatus[student.id] = checked ? 'present' : 'absent';
    });
    setAttendanceStatus(newStatus);
  }
  
  const handleSubmitAttendance = () => {
    const absentCount = Object.values(attendanceStatus).filter(s => s === 'absent').length;
    toast({
        title: "Attendance Submitted",
        description: `Attendance for Class ${selectedClass} on ${format(attendanceDate!, 'PPP')} has been recorded. ${absentCount} student(s) marked absent.`
    });
  }

  const allPresent = useMemo(() => {
    if (Object.keys(attendanceStatus).length === 0) return true;
    return Object.values(attendanceStatus).every(s => s === 'present');
  }, [attendanceStatus]);

  return (
    <Tabs defaultValue="mark" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="insights">AI Insights & Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mark" className="mt-4">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Mark Daily Attendance</CardTitle>
                <CardDescription>Select a class and date to mark student attendance.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => (<SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>))}</SelectContent>
                    </Select>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !attendanceDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {attendanceDate ? format(attendanceDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={attendanceDate} onSelect={setAttendanceDate} disabled={(date) => date > new Date()} /></PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            {selectedClass && (
                 <CardContent>
                    <div className="flex items-center justify-end space-x-2 mb-6">
                        <Label htmlFor="present-all-switch">Mark All Present</Label>
                        <Switch id="present-all-switch" checked={allPresent} onCheckedChange={handlePresentAllToggle} />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {studentsInClass.map(student => (
                            <Card key={student.id} className="p-3 text-center glassmorphic">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                    <AvatarImage src={student.avatar} alt={student.name} />
                                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm font-medium truncate">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.admissionNo}</p>
                                <div className="grid grid-cols-2 gap-1 mt-3">
                                    <Button
                                        size="sm"
                                        variant={attendanceStatus[student.id] === 'present' ? 'default' : 'outline'}
                                        onClick={() => handleStatusChange(student.id, 'present')}
                                        className="h-8"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={attendanceStatus[student.id] === 'absent' ? 'destructive' : 'outline'}
                                        onClick={() => handleStatusChange(student.id, 'absent')}
                                        className="h-8"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                 </CardContent>
            )}
            <CardFooter>
                <Button onClick={handleSubmitAttendance} disabled={!selectedClass || studentsInClass.length === 0}>Submit Attendance</Button>
            </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="mt-4">
        <Card className="glassmorphic">
            <CardHeader><CardTitle>Attendance History</CardTitle><CardDescription>This section is under development. You will soon be able to view and edit past attendance records here.</CardDescription></CardHeader>
            <CardContent><p className="text-muted-foreground">Check back for updates!</p></CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights" className="mt-4">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Generate AI Report</CardTitle>
                <CardDescription>
                Select a class to generate an AI-powered attendance analysis.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedClass} onValueChange={(value) => setSelectedClass(classes.find(c=>c.id===value)?.name || '')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                    {classes.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                        {c.name}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <Button onClick={handleGenerate} disabled={isGenerating || !selectedClass} className="w-full sm:w-auto">
                <Rocket className="mr-2 h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate Insights"}
                </Button>
            </CardContent>
            {error && <CardFooter><p className="text-sm text-destructive">{error}</p></CardFooter>}

            {isGenerating && <ReportSkeleton />}

            {insights && (
                <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Attendance Report for {selectedClass}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><UserX className="h-5 w-5" />Potential Truancy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead className="text-right">Absences</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {insights.potentialTruancy.length > 0 ? (
                            insights.potentialTruancy.map((student) => (
                                <TableRow key={student.studentId}>
                                <TableCell className="font-medium">{studentMap.get(student.studentId) || student.studentId}</TableCell>
                                <TableCell className="text-right text-destructive font-bold">{student.numberOfAbsences}</TableCell>
                                </TableRow>
                            ))
                            ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">No significant truancy patterns detected.</TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                        </Table>
                    </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overall Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{insights.overallAttendanceTrend}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-accent"/>Suggested Interventions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-line">{insights.suggestedInterventions}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                </CardContent>
            )}
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const ReportSkeleton = () => (
    <CardContent className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  );

    