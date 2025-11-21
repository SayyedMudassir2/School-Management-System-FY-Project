
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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type StudentProfile } from '@/lib/mock-data';

type PromotionClientProps = {
  allClasses: { id: string; name: string }[];
  allStudents: StudentProfile[];
};

export function PromotionClient({ allClasses, allStudents }: PromotionClientProps) {
  const [fromClass, setFromClass] = useState<string>('');
  const [toClass, setToClass] = useState<string>('');
  const [students, setStudents] = useState<StudentProfile[]>(allStudents);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const studentsInClass = useMemo(() => {
    if (!fromClass) return [];
    const classNameToMatch = allClasses.find(c => c.id === fromClass)?.name;
    return students.filter(s => s.class === classNameToMatch?.split('-')[0].replace('Class ', ''));
  }, [fromClass, students, allClasses]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(studentsInClass.map(s => s.id)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    const newSelection = new Set(selectedStudents);
    if (checked) {
      newSelection.add(studentId);
    } else {
      newSelection.delete(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const handlePromote = () => {
    if (selectedStudents.size === 0 || !toClass) {
        toast({
            variant: "destructive",
            title: "Promotion Failed",
            description: "Please select students and a target class.",
        });
        return;
    }

    const newClassName = allClasses.find(c => c.id === toClass)?.name;
    if (!newClassName) return;

    setStudents(prevStudents => 
        prevStudents.map(student => {
            if (selectedStudents.has(student.id)) {
                return { ...student, class: newClassName.split('-')[0].replace('Class ', '') };
            }
            return student;
        })
    );
    
    toast({
        title: "Promotion Successful",
        description: `${selectedStudents.size} students have been promoted to ${newClassName}.`
    });
    setSelectedStudents(new Set());
  };

  const handleGraduate = () => {
     if (selectedStudents.size === 0) {
        toast({
            variant: "destructive",
            title: "Action Failed",
            description: "Please select students to graduate.",
        });
        return;
    }

    setStudents(prevStudents =>
        prevStudents.map(student => {
            if(selectedStudents.has(student.id)) {
                return { ...student, status: 'Alumni' };
            }
            return student;
        })
    );

    toast({
        title: "Students Graduated",
        description: `${selectedStudents.size} students have been marked as Alumni.`
    });
    setSelectedStudents(new Set());
  }

  const isAllSelected = selectedStudents.size > 0 && selectedStudents.size === studentsInClass.length;

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Promotion Workflow</CardTitle>
        <CardDescription>Select a class to view students, then choose an action.</CardDescription>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div>
                <label className="text-sm font-medium">From Class</label>
                <Select value={fromClass} onValueChange={setFromClass}>
                    <SelectTrigger><SelectValue placeholder="Select a class to promote from" /></SelectTrigger>
                    <SelectContent>
                        {allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-medium">To Class</label>
                 <Select value={toClass} onValueChange={setToClass}>
                    <SelectTrigger><SelectValue placeholder="Select a class to promote to" /></SelectTrigger>
                    <SelectContent>
                        {allClasses.filter(c => c.id !== fromClass).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[50px]">
                    <Checkbox 
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        disabled={studentsInClass.length === 0}
                    />
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {studentsInClass.length > 0 ? (
                    studentsInClass.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <Checkbox 
                                    checked={selectedStudents.has(student.id)}
                                    onCheckedChange={(checked) => handleSelectStudent(student.id, !!checked)}
                                />
                            </TableCell>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.admissionNo}</TableCell>
                            <TableCell>{student.status}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                            {fromClass ? 'No students found in this class.' : 'Please select a class to see students.'}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-end gap-4">
        <Button variant="secondary" onClick={handleGraduate} disabled={selectedStudents.size === 0}>
            <GraduationCap className="mr-2 h-4 w-4"/> Mark as Graduated
        </Button>
        <Button onClick={handlePromote} disabled={selectedStudents.size === 0 || !toClass}>
            Promote Selected <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
