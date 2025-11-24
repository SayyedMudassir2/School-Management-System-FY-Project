
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp, ClipboardList, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { StudentAssignment } from '@/lib/mock-data';
import { format, isPast } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

type AssignmentsClientProps = {
  initialAssignments: StudentAssignment[];
};

export function AssignmentsClient({ initialAssignments }: AssignmentsClientProps) {
    const { toast } = useToast();
    const [assignments, setAssignments] = useState<StudentAssignment[]>(initialAssignments);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState<StudentAssignment | null>(null);

    const { todo, completed } = useMemo(() => {
        return assignments.reduce((acc, assignment) => {
            if (assignment.status === 'Pending') {
                acc.todo.push(assignment);
            } else {
                acc.completed.push(assignment);
            }
            return acc;
        }, { todo: [] as StudentAssignment[], completed: [] as StudentAssignment[] });
    }, [assignments]);
    
    const handleOpenSubmitDialog = (assignment: StudentAssignment) => {
        setCurrentAssignment(assignment);
        setIsSubmitOpen(true);
    };

    const handleSubmit = () => {
        if (!currentAssignment) return;

        setAssignments(prev => prev.map(a => 
            a.id === currentAssignment.id ? { ...a, status: 'Submitted' } : a
        ));

        toast({
            title: "Assignment Submitted!",
            description: `Your submission for "${currentAssignment.title}" has been recorded.`
        });
        setIsSubmitOpen(false);
    }
    
    const getStatusBadge = (status: StudentAssignment['status'], dueDate: string) => {
        if (status === 'Pending' && isPast(new Date(dueDate))) {
            return <Badge variant="destructive">Overdue</Badge>;
        }
        switch(status) {
            case 'Pending': return <Badge variant="secondary">To Do</Badge>;
            case 'Submitted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/20">Submitted</Badge>;
            case 'Graded': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Graded</Badge>;
        }
    };


  return (
    <>
        <Tabs defaultValue="todo" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="todo"><Clock className="mr-2 h-4 w-4"/>To Do ({todo.length})</TabsTrigger>
                <TabsTrigger value="completed"><CheckCircle className="mr-2 h-4 w-4"/>Completed ({completed.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="todo" className="mt-4">
                <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Pending Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Title</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {todo.length > 0 ? todo.map(assignment => (
                                    <TableRow key={assignment.id}>
                                        <TableCell>{assignment.subject}</TableCell>
                                        <TableCell className="font-medium">{assignment.title}</TableCell>
                                        <TableCell>{format(new Date(assignment.dueDate), 'dd MMM, yyyy')}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleOpenSubmitDialog(assignment)}>Submit</Button>
                                        </TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={4} className="h-24 text-center">No pending assignments. Great job!</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
                 <Card className="glassmorphic">
                    <CardHeader>
                        <CardTitle>Completed Assignments</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Title</TableHead><TableHead>Status</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {completed.length > 0 ? completed.map(assignment => (
                                    <TableRow key={assignment.id}>
                                        <TableCell>{assignment.subject}</TableCell>
                                        <TableCell className="font-medium">{assignment.title}</TableCell>
                                        <TableCell>{getStatusBadge(assignment.status, assignment.dueDate)}</TableCell>
                                        <TableCell className="font-semibold">{assignment.grade || 'Not Graded'}</TableCell>
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={4} className="h-24 text-center">No completed assignments yet.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit: {currentAssignment?.title}</DialogTitle>
                    <DialogDescription>
                        Due on {currentAssignment && format(new Date(currentAssignment.dueDate), 'dd MMM, yyyy')}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="submission-text">Text Submission (Optional)</Label>
                        <Textarea id="submission-text" placeholder="You can type your answer here..."/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="submission-file">Upload File</Label>
                        <Input id="submission-file" type="file" />
                        <p className="text-xs text-muted-foreground">Attach a PDF, DOCX, or image file.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsSubmitOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit}><FileUp className="mr-2 h-4 w-4"/>Submit Assignment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
