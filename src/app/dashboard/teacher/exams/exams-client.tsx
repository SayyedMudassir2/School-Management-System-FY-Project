
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { classes, studentDirectory, teacherDirectory } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History"];
const terms = ["Term 1", "Term 2", "Finals"];

export function ExamsClient() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [marks, setMarks] = useState<Record<string, string>>({});

  const studentsInClass = studentDirectory.filter(s => {
    if (!selectedClass) return false;
    const [className, section] = classes.find(c => c.id === selectedClass)!.name.split(' ')[1].split('-');
    return s.class === className && s.section === section;
  });

  const handleMarkChange = (studentId: string, mark: string) => {
    setMarks(prev => ({ ...prev, [studentId]: mark }));
  };

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
            {selectedClass && selectedSubject && <CardContent><Button>Save Marks</Button></CardContent>}
        </Card>
      </TabsContent>
      <TabsContent value="schedule" className="mt-4">
         <Card className="glassmorphic">
            <CardHeader><CardTitle>Exam Schedule</CardTitle><CardDescription>This feature is under development.</CardDescription></CardHeader>
            <CardContent><p className="text-muted-foreground">Check back soon for the exam schedule view.</p></CardContent>
         </Card>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
         <Card className="glassmorphic">
            <CardHeader><CardTitle>Progress Reports</CardTitle><CardDescription>This feature is under development.</CardDescription></CardHeader>
            <CardContent><p className="text-muted-foreground">Check back soon to generate and view student progress reports.</p></CardContent>
         </Card>
      </TabsContent>
    </Tabs>
  );
}
