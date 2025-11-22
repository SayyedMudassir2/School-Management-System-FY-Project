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
import { useToast } from '@/hooks/use-toast';
import { teacherDirectory, type TeacherProfile } from '@/lib/mock-data';
import { BookCheck, UserCheck } from 'lucide-react';

const academicYears = ["2024-2025", "2023-2024"];
const classes = ["Class 10", "Class 9", "Class 8"];
const sections = ["A", "B", "C"];
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Computer Science"];

type SubjectAssignment = {
    id: string;
    class: string;
    section: string;
    subject: string;
    teacherId: string;
};

const initialSubjectAssignments: SubjectAssignment[] = [
    { id: 'sa1', class: 'Class 10', section: 'A', subject: 'Mathematics', teacherId: 'T02'},
    { id: 'sa2', class: 'Class 10', section: 'A', subject: 'Physics', teacherId: 'T01'},
    { id: 'sa3', class: 'Class 9', section: 'B', subject: 'History', teacherId: 'T05'},
];

type ClassTeacherAssignment = {
    id: string;
    academicYear: string;
    class: string;
    section: string;
    teacherId: string;
};

const initialClassTeacherAssignments: ClassTeacherAssignment[] = [
    { id: 'cta1', academicYear: '2024-2025', class: 'Class 10', section: 'A', teacherId: 'T01' },
    { id: 'cta2', academicYear: '2024-2025', class: 'Class 9', section: 'B', teacherId: 'T02' },
];

export function AssignClient() {
    const { toast } = useToast();
    const [teachers] = useState<TeacherProfile[]>(teacherDirectory);
    const teacherMap = useMemo(() => new Map(teachers.map(t => [t.id, t.name])), [teachers]);

    // State for Class Teacher Assignment
    const [ctaYear, setCtaYear] = useState('');
    const [ctaClass, setCtaClass] = useState('');
    const [ctaSection, setCtaSection] = useState('');
    const [ctaTeacher, setCtaTeacher] = useState('');
    const [classTeacherAssignments, setClassTeacherAssignments] = useState(initialClassTeacherAssignments);

    // State for Subject Assignment
    const [saClass, setSaClass] = useState('');
    const [saSection, setSaSection] = useState('');
    const [saSubject, setSaSubject] = useState('');
    const [saTeacher, setSaTeacher] = useState('');
    const [subjectAssignments, setSubjectAssignments] = useState(initialSubjectAssignments);

    const handleAssignClassTeacher = () => {
        if (!ctaYear || !ctaClass || !ctaSection || !ctaTeacher) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields to assign a class teacher.' });
            return;
        }
        
        const existingAssignmentIndex = classTeacherAssignments.findIndex(
            a => a.academicYear === ctaYear && a.class === ctaClass && a.section === ctaSection
        );

        const newAssignment = {
            id: `cta${Date.now()}`,
            academicYear: ctaYear,
            class: ctaClass,
            section: ctaSection,
            teacherId: ctaTeacher
        };

        if (existingAssignmentIndex > -1) {
            const updatedAssignments = [...classTeacherAssignments];
            updatedAssignments[existingAssignmentIndex] = { ...updatedAssignments[existingAssignmentIndex], teacherId: ctaTeacher };
            setClassTeacherAssignments(updatedAssignments);
        } else {
            setClassTeacherAssignments([...classTeacherAssignments, newAssignment]);
        }

        toast({ title: 'Success', description: `${teacherMap.get(ctaTeacher)} assigned as class teacher for ${ctaClass}-${ctaSection}.`});
    };
    
    const handleAssignSubject = () => {
        if (!saClass || !saSection || !saSubject || !saTeacher) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please fill out all fields to assign a subject.' });
            return;
        }

        const newAssignment: SubjectAssignment = {
            id: `sa${Date.now()}`,
            class: saClass,
            section: saSection,
            subject: saSubject,
            teacherId: saTeacher
        };

        setSubjectAssignments([newAssignment, ...subjectAssignments]);
        toast({ title: 'Success', description: `${saSubject} assigned to ${teacherMap.get(saTeacher)} for ${saClass}-${saSection}.`});
    };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><UserCheck className="h-6 w-6 text-primary"/>Assign Class Teacher</CardTitle>
                <CardDescription>Assign or change the main teacher for a class section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                    <Select value={ctaYear} onValueChange={setCtaYear}>
                        <SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger>
                        <SelectContent>{academicYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Class & Section</label>
                    <div className="grid grid-cols-2 gap-4">
                         <Select value={ctaClass} onValueChange={setCtaClass}>
                            <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                         <Select value={ctaSection} onValueChange={setCtaSection}>
                            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                            <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Class Teacher</label>
                    <Select value={ctaTeacher} onValueChange={setCtaTeacher}>
                        <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                        <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleAssignClassTeacher}>Assign Class Teacher</Button>
            </CardFooter>
        </Card>
        
        <Card className="glassmorphic">
            <CardHeader>
                <CardTitle className="flex items-center gap-3"><BookCheck className="h-6 w-6 text-primary"/>Assign Subjects to Teachers</CardTitle>
                <CardDescription>Allocate subjects to teachers for specific classes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Class</label>
                        <Select value={saClass} onValueChange={setSaClass}>
                            <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>{classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Section</label>
                        <Select value={saSection} onValueChange={setSaSection}>
                            <SelectTrigger><SelectValue placeholder="Select Section" /></SelectTrigger>
                            <SelectContent>{sections.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={saSubject} onValueChange={setSaSubject}>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Teacher</label>
                    <Select value={saTeacher} onValueChange={setSaTeacher}>
                        <SelectTrigger><SelectValue placeholder="Select a teacher" /></SelectTrigger>
                        <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleAssignSubject}>Assign Subject</Button>
            </CardFooter>
        </Card>

        <div className="lg:col-span-2">
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Current Assignments</CardTitle>
                    <CardDescription>Overview of all teacher assignments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Class</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Teacher</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classTeacherAssignments.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.class}-{a.section}</TableCell>
                                    <TableCell>N/A</TableCell>
                                    <TableCell>{teacherMap.get(a.teacherId) || 'Unknown'}</TableCell>
                                    <TableCell><div className="font-semibold text-primary">Class Teacher</div></TableCell>
                                </TableRow>
                            ))}
                            {subjectAssignments.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell className="font-medium">{a.class}-{a.section}</TableCell>
                                    <TableCell>{a.subject}</TableCell>
                                    <TableCell>{teacherMap.get(a.teacherId) || 'Unknown'}</TableCell>
                                    <TableCell>Subject Teacher</TableCell>
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
