
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlusCircle, Search, Filter, CalendarIcon, FileUp, Download } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { type StudentProfile } from '@/lib/mock-data';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const assignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date({ required_error: 'Due date is required'}),
  class: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  file: z.any().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentSchema>;

type Assignment = {
    id: string;
    title: string;
    class: string;
    subject: string;
    dueDate: string;
    submissions: number;
    totalStudents: number;
};

type AssignmentsClientProps = {
  initialAssignments: Assignment[];
  classes: { id: string; name: string; }[];
  students: StudentProfile[];
};

const subjects = ["Mathematics", "Biology", "History", "Physics", "English"];

export function AssignmentsClient({ initialAssignments, classes, students }: AssignmentsClientProps) {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentSchema),
  });

  const filteredAssignments = useMemo(() => {
      return assignments.filter(a => 
        (classFilter === 'all' || a.class === classFilter) &&
        (subjectFilter === 'all' || a.subject === subjectFilter)
      );
  }, [assignments, classFilter, subjectFilter]);

  const handleOpenDialog = () => {
    reset({
      title: '',
      description: '',
      class: '',
      subject: ''
    });
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<AssignmentFormValues> = (data) => {
    const newAssignment: Assignment = {
      id: `AS${Date.now()}`,
      title: data.title,
      class: data.class,
      subject: data.subject,
      dueDate: format(data.dueDate, 'yyyy-MM-dd'),
      submissions: 0,
      totalStudents: students.filter(s => `Class ${s.class}-${s.section}` === data.class).length,
    };
    setAssignments([newAssignment, ...assignments]);
    toast({ title: 'Success', description: 'New assignment has been created.' });
    setIsDialogOpen(false);
  };
  
  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Assignment Dashboard</CardTitle>
              <CardDescription>An overview of all active and past assignments.</CardDescription>
            </div>
            <Button onClick={handleOpenDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Assignment
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
             <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Filter by subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Class</TableHead><TableHead>Subject</TableHead><TableHead>Due Date</TableHead><TableHead>Submissions</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.title}</TableCell>
                    <TableCell>{assignment.class}</TableCell>
                    <TableCell>{assignment.subject}</TableCell>
                    <TableCell>{format(new Date(assignment.dueDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                           <Progress value={(assignment.submissions / assignment.totalStudents) * 100} className="w-24"/>
                           <span>{assignment.submissions}/{assignment.totalStudents}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/teacher/assignments/${assignment.id}`}>View Submissions</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
             {filteredAssignments.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No assignments found for the selected filters.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>Fill out the details below to create a new assignment.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" {...register('description')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class</Label>
                  <Controller name="class" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                      <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  )}/>
                   {errors.class && <p className="text-destructive text-xs">{errors.class.message}</p>}
                </div>
                <div className="space-y-2">
                   <Label>Subject</Label>
                  <Controller name="subject" control={control} render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select Subject"/></SelectTrigger>
                      <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  )}/>
                  {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Controller name="dueDate" control={control} render={({ field }) => (
                      <Popover><PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover>
                    )}/>
                    {errors.dueDate && <p className="text-destructive text-xs">{errors.dueDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Attach File (Optional)</Label>
                  <Input id="file" type="file" {...register('file')} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Create Assignment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
