
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAttendanceInsights, type AttendanceInsightsOutput } from '@/ai/flows/attendance-insights';
import { mockAttendanceRecords, studentDirectory as allStudentsData } from '@/lib/mock-data';
import { Rocket, FileText, UserX, Lightbulb, Check, X, Calendar as CalendarIcon, UserCheck, Edit, History, Save, Download, FileSpreadsheet, File } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, getMonth, getYear, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';
import { Input } from '@/components/ui/input';

type Class = { id: string; name: string };
type Student = { id: string; name: string; avatar: string; admissionNo: string; classId?: string };

type AttendanceClientProps = {
  classes: Class[];
  students: Student[];
};

type AttendanceStatus = { [studentId: string]: 'present' | 'absent' };
type AttendanceRecord = { studentId: string; status: 'present' | 'absent'; date: string };

export function AttendanceClient({ classes, students: initialStudents }: AttendanceClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [insights, setInsights] = useState<AttendanceInsightsOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const studentMap = useMemo(() => new Map(initialStudents.map(s => [s.id, s])), [initialStudents]);

  // State for marking attendance
  const [attendanceDate, setAttendanceDate] = useState<Date | undefined>(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({});
  
  // State for history view
  const [historyClass, setHistoryClass] = useState<string>("");
  const [historyDate, setHistoryDate] = useState<Date | undefined>(new Date());
  const [historyRecords, setHistoryRecords] = useState<AttendanceRecord[]>([]);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  // State for reports
  const [reportClass, setReportClass] = useState<string>('');
  const [reportMonth, setReportMonth] = useState<Date>(new Date());
  const [reportStudent, setReportStudent] = useState<string>('');

  const studentsInClass = useMemo(() => {
    const className = classes.find(c => c.id === selectedClass)?.name;
    if (!className) return [];
    return allStudentsData
      .filter(s => `Class ${s.class}-${s.section}` === className && s.status === 'Active')
      .map(s => ({...s, classId: selectedClass}));
  }, [selectedClass, classes]);

  const studentsInHistoryClass = useMemo(() => {
    if (!historyClass) return [];
    const className = classes.find(c => c.id === historyClass)?.name;
    return allStudentsData
      .filter(s => `Class ${s.class}-${s.section}` === className && s.status === 'Active');
  }, [historyClass, classes]);
  
  const studentsInReportClass = useMemo(() => {
    if (!reportClass) return [];
    const className = classes.find(c => c.id === reportClass)?.name;
    return allStudentsData.filter(s => `Class ${s.class}-${s.section}` === className && s.status === 'Active');
  }, [reportClass, classes]);

  // Effect to initialize attendance when class or date changes
  useEffect(() => {
    const newStatus: AttendanceStatus = {};
    studentsInClass.forEach(student => {
      newStatus[student.id] = 'present';
    });
    setAttendanceStatus(newStatus);
  }, [selectedClass, attendanceDate, studentsInClass]);
  
  // Effect to fetch history records
  useEffect(() => {
    if(historyClass && historyDate) {
        const mockData: AttendanceRecord[] = studentsInHistoryClass.map(student => ({
            studentId: student.id,
            status: Math.random() > 0.1 ? 'present' : 'absent',
            date: historyDate.toISOString()
        }));
        setHistoryRecords(mockData);
        setEditingStudentId(null);
    } else {
        setHistoryRecords([]);
    }
  }, [historyClass, historyDate, studentsInHistoryClass]);

  const classReportData = useMemo(() => {
    if (!reportClass) return [];
    const monthStart = startOfMonth(reportMonth);
    const monthEnd = endOfMonth(reportMonth);
    
    return studentsInReportClass.map(student => {
      const studentRecords = mockAttendanceRecords.filter(r => 
        r.studentId === student.id &&
        new Date(r.date) >= monthStart &&
        new Date(r.date) <= monthEnd
      );
      const present = studentRecords.filter(r => r.isPresent).length;
      const absent = studentRecords.length - present;
      const total = studentRecords.length;
      const percentage = total > 0 ? (present / total) * 100 : 100;
      return { student, present, absent, total, percentage };
    });
  }, [reportClass, reportMonth, studentsInReportClass]);

  const individualReportData = useMemo(() => {
    if (!reportStudent) return null;
    const monthStart = startOfMonth(reportMonth);
    const monthEnd = endOfMonth(reportMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const studentRecords = new Map(mockAttendanceRecords
      .filter(r => r.studentId === reportStudent && new Date(r.date) >= monthStart && new Date(r.date) <= monthEnd)
      .map(r => [format(new Date(r.date), 'yyyy-MM-dd'), r.isPresent]));

    return daysInMonth.map(day => ({
        date: day,
        status: studentRecords.get(format(day, 'yyyy-MM-dd'))
    }));
  }, [reportStudent, reportMonth]);


  const handleGenerate = async () => {
    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    const className = classes.find(c => c.id === selectedClass)?.name;
    if (!className) {
      setError("Invalid class selected.");
      return;
    }
    
    setError(null);
    setIsGenerating(true);
    setInsights(null);

    try {
      const result = await getAttendanceInsights({
        attendanceRecords: mockAttendanceRecords,
        classDetails: `Class: ${className}`,
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
    setAttendanceStatus(prev => ({ ...prev, [studentId]: status }));
  };

  const handlePresentAllToggle = (checked: boolean) => {
    const newStatus: AttendanceStatus = {};
    studentsInClass.forEach(student => { newStatus[student.id] = checked ? 'present' : 'absent'; });
    setAttendanceStatus(newStatus);
  }
  
  const handleSubmitAttendance = () => {
    const className = classes.find(c => c.id === selectedClass)?.name;
    const absentCount = Object.values(attendanceStatus).filter(s => s === 'absent').length;
    toast({
        title: "Attendance Submitted",
        description: `Attendance for ${className} on ${format(attendanceDate!, 'PPP')} has been recorded. ${absentCount} student(s) marked absent.`
    });
  }

  const handleHistoryStatusChange = (studentId: string, newStatus: 'present' | 'absent') => {
    setHistoryRecords(prev => prev.map(rec => rec.studentId === studentId ? { ...rec, status: newStatus, date: rec.date } : rec));
  };
  
  const handleSaveHistoryChange = (studentId: string) => {
    const student = studentsInHistoryClass.find(s => s.id === studentId);
    setEditingStudentId(null);
    toast({ title: "Attendance Updated", description: `Attendance for ${student?.name} has been updated.` });
  };

  const handleExportExcel = () => {
    if (!classReportData) return;
    const dataForExport = classReportData.map(({ student, present, absent, total, percentage }) => ({
      "Admission No": student.admissionNo,
      "Student Name": student.name,
      "Present Days": present,
      "Absent Days": absent,
      "Total Days": total,
      "Attendance %": percentage.toFixed(2),
    }));

    const csv = Papa.unparse(dataForExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `attendance_summary_${classes.find(c=>c.id === reportClass)?.name}_${format(reportMonth, 'MMM_yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleExportPdf = () => {
    toast({
        title: "Print Triggered",
        description: "Your browser's print dialog should appear. Choose 'Save as PDF'. This feature is a placeholder for a more robust PDF generation.",
    });
    setTimeout(() => window.print(), 500);
  };

  const allPresent = useMemo(() => {
    if (Object.keys(attendanceStatus).length === 0) return true;
    return Object.values(attendanceStatus).every(s => s === 'present');
  }, [attendanceStatus]);

  const getStatusBadge = (status: 'present' | 'absent') => {
    return status === 'present' 
        ? <Badge variant="secondary" className="bg-green-500/20 text-green-700 border-green-500/20">Present</Badge>
        : <Badge variant="destructive">Absent</Badge>
  }
  
  const printRef = useRef<HTMLDivElement>(null);

  return (
    <>
    <Tabs defaultValue="mark" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="insights">Reports &amp; Insights</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mark" className="mt-4">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Mark Daily Attendance</CardTitle>
                <CardDescription>Select a class and date to mark student attendance.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
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
                                    <Button size="sm" variant={attendanceStatus[student.id] === 'present' ? 'default' : 'outline'} onClick={() => handleStatusChange(student.id, 'present')} className="h-8">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant={attendanceStatus[student.id] === 'absent' ? 'destructive' : 'outline'} onClick={() => handleStatusChange(student.id, 'absent')} className="h-8">
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
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary"/>Attendance History</CardTitle>
                <CardDescription>View past attendance records for any class on a specific date.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={historyClass} onValueChange={setHistoryClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>{classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                    </Select>
                     <Popover>
                        <PopoverTrigger asChild>
                            <Button variant={"outline"} className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !historyDate && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {historyDate ? format(historyDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={historyDate} onSelect={setHistoryDate} disabled={(date) => date > new Date()} /></PopoverContent>
                    </Popover>
                </div>
            </CardHeader>
            <CardContent>
                {historyRecords.length > 0 ? (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Admission No.</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {studentsInHistoryClass.map(student => {
                                    const record = historyRecords.find(r => r.studentId === student.id);
                                    const isEditing = editingStudentId === student.id;

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.admissionNo}</TableCell>
                                            <TableCell>
                                                {isEditing ? (
                                                    <div className="flex gap-2">
                                                        <Button size="xs" variant={record?.status === 'present' ? 'default' : 'outline'} onClick={() => handleHistoryStatusChange(student.id, 'present')}>Present</Button>
                                                        <Button size="xs" variant={record?.status === 'absent' ? 'destructive' : 'outline'} onClick={() => handleHistoryStatusChange(student.id, 'absent')}>Absent</Button>
                                                    </div>
                                                ) : (
                                                    record ? getStatusBadge(record.status) : <Badge variant="outline">N/A</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {isEditing ? (
                                                    <Button variant="outline" size="sm" onClick={() => handleSaveHistoryChange(student.id)}>
                                                        <Save className="h-3 w-3 mr-1"/> Save
                                                    </Button>
                                                ) : (
                                                    <Button variant="outline" size="sm" onClick={() => setEditingStudentId(student.id)}>
                                                        <Edit className="h-3 w-3 mr-1"/> Edit
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        <p>{historyClass ? 'No records found for this date.' : 'Please select a class to view history.'}</p>
                    </div>
                )}
            </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="insights" className="mt-4 space-y-6">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Class Attendance Summary</CardTitle>
                <CardDescription>Monthly attendance overview for a selected class.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Select value={reportClass} onValueChange={setReportClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a class" /></SelectTrigger>
                        <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                     <Input type="month" value={format(reportMonth, 'yyyy-MM')} onChange={e => setReportMonth(new Date(e.target.value))} className="w-full sm:w-[200px]" />
                </div>
                {reportClass && classReportData && (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Present</TableHead><TableHead>Absent</TableHead><TableHead>Total</TableHead><TableHead>Percentage</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {classReportData.map(({student, present, absent, total, percentage}) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{present}</TableCell>
                                        <TableCell>{absent}</TableCell>
                                        <TableCell>{total}</TableCell>
                                        <TableCell><Badge variant={percentage < 75 ? 'destructive' : 'default'}>{percentage.toFixed(1)}%</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button onClick={handleExportExcel} disabled={!reportClass}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export to Excel</Button>
            </CardFooter>
        </Card>
        
        <div ref={printRef}>
            <Card className="glassmorphic printable-area">
                <CardHeader>
                    <CardTitle>Individual Student Report</CardTitle>
                    <CardDescription>Detailed monthly report for a single student.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 non-printable">
                         <Select value={reportStudent} onValueChange={setReportStudent}>
                            <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a student" /></SelectTrigger>
                            <SelectContent>{allStudentsData.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.admissionNo})</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     {reportStudent && individualReportData && (
                        <div>
                             <div className="text-center mb-4 border-b pb-2">
                                <h3 className="text-lg font-bold">{studentMap.get(reportStudent)?.name}</h3>
                                <p className="text-sm text-muted-foreground">Attendance Report for {format(reportMonth, 'MMMM yyyy')}</p>
                            </div>
                            <div className="grid grid-cols-7 gap-2 text-center text-xs">
                                {individualReportData.map(({ date, status }) => {
                                    const day = format(date, 'd');
                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                    let statusClass = 'bg-muted/30';
                                    if(status === true) statusClass = 'bg-green-500/80 text-white';
                                    if(status === false) statusClass = 'bg-destructive/80 text-white';
                                    if(isWeekend) statusClass = 'bg-muted/10 text-muted-foreground';
                                    
                                    return <div key={date.toString()} className={cn("h-8 w-8 flex items-center justify-center rounded-full", statusClass)}>{day}</div>
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="non-printable">
                    <Button onClick={handleExportPdf} disabled={!reportStudent}><File className="mr-2 h-4 w-4" /> Export to PDF</Button>
                </CardFooter>
            </Card>
        </div>


        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Generate AI Report</CardTitle>
                <CardDescription>Select a class to generate an AI-powered attendance analysis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select a class" /></SelectTrigger>
                    <SelectContent>{classes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
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
                    Attendance Report for {classes.find(c => c.id === selectedClass)?.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><UserX className="h-5 w-5" />Potential Truancy</CardTitle></CardHeader><CardContent>
                        <Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead className="text-right">Absences</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {insights.potentialTruancy.length > 0 ? (
                            insights.potentialTruancy.map((student) => (<TableRow key={student.studentId}><TableCell className="font-medium">{studentMap.get(student.studentId)?.name || student.studentId}</TableCell><TableCell className="text-right text-destructive font-bold">{student.numberOfAbsences}</TableCell></TableRow>))
                            ) : (<TableRow><TableCell colSpan={2} className="text-center text-muted-foreground py-8">No significant truancy patterns detected.</TableCell></TableRow>)}
                        </TableBody>
                        </Table>
                    </CardContent></Card>
                    <div className="space-y-6">
                        <Card><CardHeader><CardTitle>Overall Trend</CardTitle></CardHeader><CardContent><p className="text-muted-foreground">{insights.overallAttendanceTrend}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-accent"/>Suggested Interventions</CardTitle></CardHeader><CardContent><p className="text-muted-foreground whitespace-pre-line">{insights.suggestedInterventions}</p></CardContent></Card>
                    </div>
                </div>
                </CardContent>
            )}
        </Card>
      </TabsContent>
    </Tabs>
     <style jsx global>{`
        @media print {
            body * {
                visibility: hidden;
            }
            .printable-area, .printable-area * {
                visibility: visible;
            }
            .printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            .non-printable {
                display: none;
            }
            .glassmorphic {
                background: white !important;
                border: none !important;
                box-shadow: none !important;
            }
        }
    `}</style>
    </>
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
