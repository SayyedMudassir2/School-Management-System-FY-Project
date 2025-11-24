
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePen, Calendar, BarChart, Printer, Download } from 'lucide-react';
import { classes, studentDirectory } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const terms = ["Term 1", "Term 2", "Finals"];

const mockSchedule = [
    { classId: '10a', term: 'Term 1', subject: 'Mathematics', date: '2024-09-02', time: '09:00 AM - 12:00 PM' },
    { classId: '10a', term: 'Term 1', subject: 'Physics', date: '2024-09-04', time: '09:00 AM - 12:00 PM' },
    { classId: '10a', term: 'Term 2', subject: 'Mathematics', date: '2024-12-09', time: '09:00 AM - 12:00 PM' },
    { classId: '9b', term: 'Term 1', subject: 'History', date: '2024-09-03', time: '09:00 AM - 12:00 PM' },
];

const mockMarks = {
    S001: { Mathematics: 95, Physics: 88, Chemistry: 91, Biology: 94, English: 85, History: 90 },
    S002: { Mathematics: 75, Physics: 68, Chemistry: 72, Biology: 80, English: 78, History: 65 },
    S004: { Mathematics: 88, Physics: 92, Chemistry: 85, Biology: 89, English: 91, History: 84 },
};

const getGrade = (marks: number) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
};

const chartConfig = {
  marks: {
    label: "Marks",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function ExamsClient() {
  const { toast } = useToast();
  // Marks Entry State
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState<Record<string, string>>({});

  // Schedule State
  const [scheduleClass, setScheduleClass] = useState('');
  const [scheduleTerm, setScheduleTerm] = useState('');
  
  // Reports State
  const [reportClass, setReportClass] = useState('');
  const [reportStudentId, setReportStudentId] = useState('');

  const studentsInClass = studentDirectory.filter(s => {
    if (!selectedClass) return false;
    const [className, section] = classes.find(c => c.id === selectedClass)!.name.split(' ')[1].split('-');
    return s.class === className && s.section === section;
  });
  
  const studentsInReportClass = studentDirectory.filter(s => {
    if (!reportClass) return false;
    const [className, section] = classes.find(c => c.id === reportClass)!.name.split(' ')[1].split('-');
    return s.class === className && s.section === section;
  });

  const selectedStudentData = useMemo(() => {
    if (!reportStudentId) return null;
    const student = studentDirectory.find(s => s.id === reportStudentId);
    // @ts-ignore
    const studentMarks = mockMarks[reportStudentId] as Record<string, number> | undefined;
    if (!student || !studentMarks) return null;
    
    const reportDetails = Object.entries(studentMarks).map(([subject, mark]) => ({
        subject,
        marks: mark,
        grade: getGrade(mark)
    }));
    
    const totalMarks = reportDetails.reduce((sum, item) => sum + item.marks, 0);
    const percentage = (totalMarks / (reportDetails.length * 100)) * 100;
    
    return {
        student,
        reportDetails,
        totalMarks,
        percentage,
        result: percentage >= 40 ? 'Pass' : 'Fail'
    };
  }, [reportStudentId]);

  const handleMarkChange = (studentId: string, mark: string) => {
    setMarks(prev => ({ ...prev, [studentId]: mark }));
  };

  const handleSaveMarks = () => {
    // Here you would typically save the marks to a database
    console.log("Saving marks:", marks);
    toast({
      title: "Marks Saved",
      description: `Marks for ${selectedSubject} in ${classes.find(c => c.id === selectedClass)?.name} have been saved.`,
    });
  };

  const filteredSchedule = useMemo(() => {
    return mockSchedule.filter(item => 
        (scheduleClass === '' || item.classId === scheduleClass) &&
        (scheduleTerm === '' || item.term === scheduleTerm)
    );
  }, [scheduleClass, scheduleTerm]);

  return (
    <Tabs defaultValue="enter-marks" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="enter-marks"><FilePen className="mr-2 h-4 w-4"/>Enter Marks</TabsTrigger>
        <TabsTrigger value="schedule"><Calendar className="mr-2 h-4 w-4"/>Exam Schedule</TabsTrigger>
        <TabsTrigger value="reports"><BarChart className="mr-2 h-4 w-4"/>Progress Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="enter-marks" className="mt-4">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Enter Exam Marks</CardTitle>
                <CardDescription>Select a class and subject to begin entering marks for students.</CardDescription>
                 <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                 </div>
            </CardHeader>
            <CardContent>
                 {selectedClass && selectedSubject ? (
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader><TableRow><TableHead>Student Name</TableHead><TableHead>Admission No.</TableHead><TableHead className="w-[150px]">Marks (out of 100)</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {studentsInClass.map(student => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.admissionNo}</TableCell>
                                        <TableCell><Input type="number" value={marks[student.id] || ''} onChange={(e) => handleMarkChange(student.id, e.target.value)} max={100} min={0} /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                 ) : (
                    <div className="text-center py-12 text-muted-foreground"><p>Please select a class and subject to enter marks.</p></div>
                 )}
            </CardContent>
            {selectedClass && selectedSubject && <CardContent><Button onClick={handleSaveMarks}>Save Marks</Button></CardContent>}
        </Card>
      </TabsContent>
      <TabsContent value="schedule" className="mt-4">
         <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Exam Schedule</CardTitle>
                <CardDescription>View upcoming exam schedules for different classes and terms.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={scheduleClass} onValueChange={setScheduleClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by Class" /></SelectTrigger>
                        <SelectContent><SelectItem value="">All Classes</SelectItem>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={scheduleTerm} onValueChange={setScheduleTerm}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by Term" /></SelectTrigger>
                        <SelectContent><SelectItem value="">All Terms</SelectItem>{terms.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Time</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredSchedule.length > 0 ? filteredSchedule.map(item => (
                                <TableRow key={`${item.classId}-${item.subject}-${item.term}-${item.date}`}>
                                    <TableCell>{format(new Date(item.date), 'dd MMM, yyyy')}</TableCell>
                                    <TableCell>{classes.find(c => c.id === item.classId)?.name}</TableCell>
                                    <TableCell>{item.subject}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center h-24">No schedule found for the selected filters.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
         </Card>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
         <Card className="glassmorphic">
            <CardHeader>
                <CardTitle>Generate Progress Reports</CardTitle>
                <CardDescription>Select a class and student to view their progress report.</CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Select value={reportClass} onValueChange={c => { setReportClass(c); setReportStudentId(''); }}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                     <Select value={reportStudentId} onValueChange={setReportStudentId} disabled={!reportClass}>
                        <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Select Student" /></SelectTrigger>
                        <SelectContent>{studentsInReportClass.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {selectedStudentData ? (
                    <Card className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-2xl font-bold">{selectedStudentData.student.name}</h3>
                                <p className="text-muted-foreground">Admission No: {selectedStudentData.student.admissionNo}</p>
                                <p className="text-muted-foreground">Class: {selectedStudentData.student.class}-{selectedStudentData.student.section}</p>
                            </div>
                            <Avatar className="h-16 w-16"><AvatarImage src={selectedStudentData.student.avatar}/><AvatarFallback>{selectedStudentData.student.name[0]}</AvatarFallback></Avatar>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                             <div>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {selectedStudentData.reportDetails.map(item => (
                                            <TableRow key={item.subject}>
                                                <TableCell>{item.subject}</TableCell>
                                                <TableCell>{item.marks}</TableCell>
                                                <TableCell>{item.grade}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg text-center">
                                    <p className="text-sm">Overall Percentage</p>
                                    <p className="text-3xl font-bold">{selectedStudentData.percentage.toFixed(2)}%</p>
                                    <p className={`font-semibold ${selectedStudentData.result === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>
                                        Result: {selectedStudentData.result}
                                    </p>
                                </div>
                             </div>
                             <div>
                                 <h4 className="font-semibold mb-2 text-center">Performance Chart</h4>
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <RechartsBarChart data={selectedStudentData.reportDetails} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="subject" type="category" width={80} />
                                        <Tooltip content={<ChartTooltipContent />} cursor={{fill: 'hsl(var(--muted))' }} />
                                        <Bar dataKey="marks" fill="var(--color-marks)" radius={4} />
                                    </RechartsBarChart>
                                </ChartContainer>
                             </div>
                        </div>
                    </Card>
                ) : (
                    <div className="text-center py-12 text-muted-foreground"><p>Please select a class and student to view the report.</p></div>
                )}
            </CardContent>
            {selectedStudentData && <CardFooter><Button><Printer className="mr-2 h-4 w-4"/>Print Report</Button></CardFooter>}
         </Card>
      </TabsContent>
    </Tabs>
  );
}
