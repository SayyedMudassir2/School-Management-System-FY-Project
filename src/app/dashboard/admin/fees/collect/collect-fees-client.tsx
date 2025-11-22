
'use client';

import { useState, useMemo, useRef } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { FileText, Printer, DollarSign } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { type StudentProfile, type Fee } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useReactToPrint } from 'react-to-print';
import { InvoicePrint } from '../invoice-print';

type CollectFeesClientProps = {
  allClasses: { id: string; name: string }[];
  allStudents: StudentProfile[];
  allFees: Fee[];
};

export function CollectFeesClient({ allClasses, allStudents, allFees }: CollectFeesClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [students, setStudents] = useState<StudentProfile[]>(allStudents);
  const [fees, setFees] = useState<Fee[]>(allFees);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const { toast } = useToast();

  const invoicePrintRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => invoicePrintRef.current,
  });

  const studentsInClass = useMemo(() => {
    if (selectedClass === 'all') return allStudents;
    const classNameToMatch = allClasses.find(c => c.id === selectedClass)?.name;
    if (!classNameToMatch) return allStudents;
    const [grade, section] = classNameToMatch.split('-');
    return students.filter(s => s.class === grade.replace('Class ', '') && s.section === section);
  }, [selectedClass, students, allClasses, allStudents]);

  const studentFeeMap = useMemo(() => {
    const map = new Map<string, Fee>();
    fees.forEach(fee => map.set(fee.studentId, fee));
    return map;
  }, [fees]);

  const handleGenerateInvoice = (studentId: string) => {
    const fee = studentFeeMap.get(studentId);
    if (fee) {
        setSelectedFee(fee);
        setIsInvoiceDialogOpen(true);
    } else {
        // Logic to create a new fee/invoice if one doesn't exist
        toast({
            title: "No Fee Found",
            description: "No fee record exists for this student. Please create one first.",
            variant: "destructive"
        });
    }
  };

  const handleMarkAsPaid = (studentId: string) => {
    setFees(prevFees => prevFees.map(fee => 
        fee.studentId === studentId ? { ...fee, status: 'Paid' } : fee
    ));
    toast({
        title: "Payment Recorded",
        description: `Fee for student ${studentId} marked as paid.`,
    });
  };

  const getStatusBadge = (status: Fee['status']) => {
    switch(status) {
      case 'Paid': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Paid</Badge>;
      case 'Unpaid': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">Unpaid</Badge>;
      case 'Overdue': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/20">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const selectedStudent = allStudents.find(s => s.id === selectedFee?.studentId);


  return (
    <>
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Student Fee Management</CardTitle>
          <CardDescription>Filter by class to view student fee statuses and take action.</CardDescription>
          <div className="pt-4">
            <label className="text-sm font-medium">Filter by Class</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {allClasses.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Admission No.</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsInClass.length > 0 ? (
                  studentsInClass.map((student) => {
                    const fee = studentFeeMap.get(student.id);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.admissionNo}</TableCell>
                        <TableCell>{fee ? getStatusBadge(fee.status) : <Badge variant="outline">Not Generated</Badge>}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleGenerateInvoice(student.id)}>
                            <FileText className="mr-2 h-4 w-4" /> Invoice
                          </Button>
                          <Button size="sm" disabled={!fee || fee.status === 'Paid'} onClick={() => handleMarkAsPaid(student.id)}>
                            <DollarSign className="mr-2 h-4 w-4" /> Collect Fee
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No students found in the selected class.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div style={{ display: 'none' }}>
        {selectedFee && selectedStudent && (
            <div ref={invoicePrintRef}>
                <InvoicePrint fee={selectedFee} studentName={selectedStudent.name} />
            </div>
        )}
      </div>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>Review the invoice details before printing.</DialogDescription>
          </DialogHeader>
          {selectedFee && selectedStudent && (
            <div className="max-h-[60vh] overflow-y-auto border rounded-md">
                <InvoicePrint fee={selectedFee} studentName={selectedStudent.name} />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsInvoiceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handlePrint}><Printer className="mr-2 h-4 w-4" /> Print Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
