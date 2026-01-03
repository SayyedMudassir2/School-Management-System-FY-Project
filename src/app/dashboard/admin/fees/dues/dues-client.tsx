
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
import { Search, MoreHorizontal, Send, FileWarning, DollarSign, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isAfter } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { type StudentProfile } from '@/lib/mock-data';


type StudentWithFee = StudentProfile & {
    feeDetails: {
        id?: string;
        studentId: string;
        amount: number;
        dueDate: string;
        status: "Paid" | "Unpaid" | "Overdue";
        invoiceNumber: string;
    } | undefined;
};

type DuesClientProps = {
  studentsWithDues: StudentWithFee[];
  allClasses: { id: string, name: string }[];
};

export function DuesClient({ studentsWithDues, allClasses }: DuesClientProps) {
  const [dues, setDues] = useState(studentsWithDues);
  const [classFilter, setClassFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithFee | null>(null);

  const filteredDues = useMemo(() => {
    return dues.filter(student => {
      const studentClassId = allClasses.find(c => c.name === `${student.class}-${student.section}`)?.id;
      const matchesClass = classFilter === 'all' || studentClassId === classFilter;
      
      const matchesSearch = searchTerm === '' ||
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesClass && matchesSearch;
    });
  }, [dues, classFilter, searchTerm, allClasses]);

  const summaryStats = useMemo(() => {
    const totalDue = filteredDues.reduce((sum, s) => sum + (s.feeDetails?.amount || 0), 0);
    const totalOverdue = filteredDues
      .filter(s => s.feeDetails?.status === 'Overdue')
      .reduce((sum, s) => sum + (s.feeDetails?.amount || 0), 0);
    const totalStudentsWithDues = filteredDues.length;
    
    return { totalDue, totalOverdue, totalStudentsWithDues };
  }, [filteredDues]);

  const getStatusBadge = (status: 'Unpaid' | 'Overdue') => {
    switch (status) {
      case 'Unpaid': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">Pending</Badge>;
      case 'Overdue': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/20">Overdue</Badge>;
    }
  };

  const handleSendReminder = (student: StudentWithFee) => {
    setSelectedStudent(student);
    setIsReminderOpen(true);
  };
  
  const handleSendEmail = () => {
    if (!selectedStudent || !selectedStudent.feeDetails) return;
    
    const parentEmail = `parent.${selectedStudent.email.split('@')[0]}@example.com`;
    const subject = `Fee Reminder for ${selectedStudent.name}`;
    const body = `
Dear ${selectedStudent.parentName},

This is a friendly reminder that a fee payment for ${selectedStudent.name} is outstanding.

Invoice Details:
----------------
Invoice Number: ${selectedStudent.feeDetails.invoiceNumber}
Amount Due: $${selectedStudent.feeDetails.amount.toLocaleString()}
Due Date: ${format(new Date(selectedStudent.feeDetails.dueDate), 'dd MMM, yyyy')}

Please make the payment at your earliest convenience.

Thank you,
Aedura Elite School
    `.trim().replace(/\n/g, '%0A');

    window.location.href = `mailto:${parentEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setIsReminderOpen(false);
  };

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Due Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryStats.totalDue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue Amount</CardTitle>
            <FileWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${summaryStats.totalOverdue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="glassmorphic">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students with Dues</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalStudentsWithDues}</div>
          </CardContent>
        </Card>
      </div>
    
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Due Fees List</CardTitle>
          <CardDescription>A list of all students with outstanding fee payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                  placeholder="Search by name or admission no..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
              />
            </div>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDues.length > 0 ? (
                  filteredDues.map(student => (
                    <TableRow key={student.id} className={student.feeDetails?.status === 'Overdue' ? 'bg-destructive/5' : ''}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}-{student.section}</TableCell>
                      <TableCell>{student.feeDetails?.invoiceNumber}</TableCell>
                      <TableCell>${student.feeDetails?.amount.toLocaleString()}</TableCell>
                      <TableCell>{student.feeDetails && format(new Date(student.feeDetails.dueDate), 'dd MMM, yyyy')}</TableCell>
                      <TableCell>{student.feeDetails && getStatusBadge(student.feeDetails.status as 'Unpaid' | 'Overdue')}</TableCell>
                      <TableCell className="text-right">
                         <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleSendReminder(student)}>
                              <Send className="mr-2 h-4 w-4" /> Send Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No pending or overdue fees found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Payment Reminder</DialogTitle>
                <DialogDescription>
                    You are about to send a fee reminder to the parent of <span className="font-semibold">{selectedStudent?.name}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-sm bg-muted/50 rounded-md p-4 border">
                <h4 className="font-semibold mb-2">Email Preview:</h4>
                <p><strong>To:</strong> {selectedStudent && `parent.${selectedStudent.email.split('@')[0]}@example.com`}</p>
                <p><strong>Subject:</strong> Fee Reminder for {selectedStudent?.name}</p>
                <hr className="my-2"/>
                <p>Dear {selectedStudent?.parentName},</p>
                <p className="mt-2">This is a friendly reminder regarding an outstanding fee payment of ${selectedStudent?.feeDetails?.amount.toLocaleString()} for {selectedStudent?.name}, which was due on {selectedStudent?.feeDetails && format(new Date(selectedStudent.feeDetails.dueDate), 'dd MMM, yyyy')}.</p>
                <p className="mt-2">Thank you.</p>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsReminderOpen(false)}>Cancel</Button>
                <Button onClick={handleSendEmail}><Send className="mr-2 h-4 w-4"/>Send Email</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
