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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, FileUp } from 'lucide-react';
import { type StudentProfile } from "@/lib/mock-data";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Submission = {
    studentId: string;
    status: 'Submitted' | 'Not Submitted' | 'Graded';
    submittedAt: string | null;
    grade: string | null;
};

type SubmissionsClientProps = {
    students: StudentProfile[];
    submissions: Submission[];
};

export function SubmissionsClient({ students, submissions: initialSubmissions }: SubmissionsClientProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [submissions, setSubmissions] = useState(initialSubmissions);
    const { toast } = useToast();

    const studentMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    
    const [filter, setFilter] = useState('All');
    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
    const [grade, setGrade] = useState('');
    const [remarks, setRemarks] = useState('');

    const filteredSubmissions = useMemo(() => {
        let filtered = submissions;

        if (filter !== 'All') {
            filtered = filtered.filter(s => s.status === filter);
        }

        if (searchTerm) {
            filtered = filtered.filter(s => {
                const student = studentMap.get(s.studentId);
                return student && student.name.toLowerCase().includes(searchTerm.toLowerCase());
            });
        }
        
        return filtered;
    }, [submissions, filter, searchTerm, studentMap]);
    
    const getStatusBadge = (status: Submission['status']) => {
        switch(status) {
            case 'Submitted': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 border-blue-500/20">Submitted</Badge>;
            case 'Not Submitted': return <Badge variant="destructive">Not Submitted</Badge>;
            case 'Graded': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Graded</Badge>;
        }
    }

    const handleGradeClick = (submission: Submission) => {
        setCurrentSubmission(submission);
        setGrade(submission.grade || '');
        setRemarks(''); // Reset remarks each time
        setIsGradingOpen(true);
    }
    
    const handleSaveGrade = () => {
        if (!currentSubmission || !grade) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Please provide a grade.',
            });
            return;
        }

        setSubmissions(submissions.map(s => 
            s.studentId === currentSubmission.studentId 
            ? { ...s, status: 'Graded', grade: grade } 
            : s
        ));

        toast({
            title: 'Graded Successfully',
            description: `Grade ${grade} has been assigned to ${studentMap.get(currentSubmission.studentId)?.name}.`,
        });

        setIsGradingOpen(false);
    }
    
    const handleDownloadAll = () => {
        toast({
            title: 'Download Started',
            description: 'A ZIP file of all submissions is being prepared for download.',
        });
    }

    return (
        <>
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                    <CardDescription>Review and grade submissions from your students.</CardDescription>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 pt-4">
                        <Tabs value={filter} onValueChange={setFilter}>
                            <TabsList>
                                <TabsTrigger value="All">All</TabsTrigger>
                                <TabsTrigger value="Submitted">Submitted</TabsTrigger>
                                <TabsTrigger value="Not Submitted">Not Submitted</TabsTrigger>
                                <TabsTrigger value="Graded">Graded</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search by student name..." 
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" onClick={handleDownloadAll}><Download className="mr-2 h-4 w-4" /> Download All</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md">
                        <Table>
                            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Status</TableHead><TableHead>Submitted On</TableHead><TableHead>Grade</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {filteredSubmissions.map(submission => {
                                    const student = studentMap.get(submission.studentId);
                                    if (!student) return null;

                                    return (
                                        <TableRow key={submission.studentId}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{getStatusBadge(submission.status)}</TableCell>
                                            <TableCell>{submission.submittedAt ? format(new Date(submission.submittedAt), 'dd MMM, yyyy') : '—'}</TableCell>
                                            <TableCell>{submission.grade || '—'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" disabled={submission.status === 'Not Submitted'} onClick={() => handleGradeClick(submission)}>
                                                    Grade
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                        {filteredSubmissions.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>No submissions match the current filters.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isGradingOpen} onOpenChange={setIsGradingOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Grade Assignment</DialogTitle>
                        <DialogDescription>
                            Grading submission for <span className="font-semibold">{currentSubmission && studentMap.get(currentSubmission.studentId)?.name}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade/Marks</Label>
                            <Input id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g., A+ or 95/100" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks (Optional)</Label>
                            <Textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Provide feedback to the student..." />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="corrected-file">Upload Corrected File (Optional)</Label>
                            <Input id="corrected-file" type="file" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsGradingOpen(false)}>Cancel</Button>
                        <Button type="button" onClick={handleSaveGrade}>Save Grade</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
