
'use client';

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, CheckCircle, Clock, Printer } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { students, classes } from "@/lib/mock-data";
import { Banknote, FileText, Scale } from "lucide-react";
import { InvoicePrint } from "./invoice-print";

const feeSchema = z.object({
  id: z.string().optional(),
  studentId: z.string().min(1, "Student is required"),
  amount: z.preprocess((val) => Number(val), z.number().positive("Amount must be positive")),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["Paid", "Unpaid", "Overdue"]),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
});

type Fee = z.infer<typeof feeSchema>;

const initialFees: Fee[] = [
  { id: '1', studentId: 'S001', amount: 2500, dueDate: "2024-08-15", status: "Paid", invoiceNumber: "INV-2024-001" },
  { id: '2', studentId: 'S002', amount: 2500, dueDate: "2024-08-15", status: "Unpaid", invoiceNumber: "INV-2024-002" },
  { id: '3', studentId: 'S003', amount: 2500, dueDate: "2024-07-15", status: "Overdue", invoiceNumber: "INV-2024-003" },
  { id: '4', studentId: 'S004', amount: 2500, dueDate: "2024-08-15", status: "Paid", invoiceNumber: "INV-2024-004" },
];

const studentMap = new Map(students.map(s => [s.id, s.name]));

export function FeesClient() {
  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [feeToPrint, setFeeToPrint] = useState<Fee | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<Fee>({
    resolver: zodResolver(feeSchema),
  });

  const printRef = useRef(false);

  useEffect(() => {
    if (feeToPrint && printRef.current) {
        window.print();
        printRef.current = false;
        setFeeToPrint(null);
    }
  }, [feeToPrint]);

  const handleOpenDialog = (fee: Fee | null = null) => {
    setEditingFee(fee);
    setSelectedClass('');
    if (fee) {
      const student = students.find(s => s.id === fee.studentId);
      if (student) {
        setSelectedClass(student.classId);
      }
      reset(fee);
    } else {
      const newInvoiceNumber = `INV-2024-${(fees.length + 1).toString().padStart(3, '0')}`;
      reset({ studentId: "", amount: 0, dueDate: "", status: "Unpaid", invoiceNumber: newInvoiceNumber });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<Fee> = (data) => {
    if (editingFee) {
      setFees(fees.map(f => f.id === editingFee.id ? { ...f, ...data } : f));
    } else {
      setFees([...fees, { ...data, id: (fees.length + 1).toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleMarkAsPaid = (feeId: string) => {
    setFees(fees.map(f => f.id === feeId ? { ...f, status: "Paid" } : f));
  };
  
  const handlePrint = (fee: Fee) => {
    setFeeToPrint(fee);
    printRef.current = true;
  };

  const { totalCollected, totalUnpaid, totalOverdue } = useMemo(() => {
    return fees.reduce((acc, fee) => {
      if (fee.status === 'Paid') {
        acc.totalCollected += fee.amount;
      } else if (fee.status === 'Unpaid') {
        acc.totalUnpaid += fee.amount;
      } else if (fee.status === 'Overdue') {
        acc.totalOverdue += fee.amount;
      }
      return acc;
    }, { totalCollected: 0, totalUnpaid: 0, totalOverdue: 0 });
  }, [fees]);

  const formatDate = (dateString: string) => {
    try {
        return format(new Date(dateString), "dd MMM yyyy");
    } catch {
        return "Invalid Date";
    }
  }

  const studentsInClass = useMemo(() => {
    if (!selectedClass) return [];
    return students.filter(s => s.classId === selectedClass);
  }, [selectedClass]);

  return (
    <>
        <div className="print:hidden">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card className="glassmorphic">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalCollected.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">This academic year</p>
                    </CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Unpaid</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalUnpaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Awaiting payment</p>
                    </CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">${totalOverdue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Past due date</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="glassmorphic">
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
                <div>
                    <CardTitle>Fee Invoices</CardTitle>
                    <CardDescription>A list of all fee invoices for the current term.</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Invoice
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fees.map(fee => (
                        <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.invoiceNumber}</TableCell>
                            <TableCell>{studentMap.get(fee.studentId) || 'Unknown Student'}</TableCell>
                            <TableCell>${fee.amount.toLocaleString()}</TableCell>
                            <TableCell>{formatDate(fee.dueDate)}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    fee.status === 'Paid' ? 'default' :
                                    fee.status === 'Overdue' ? 'destructive' : 'secondary'
                                } className={fee.status === 'Paid' ? 'bg-green-500/20 text-green-700 border-green-500/20' : ''}>
                                    {fee.status}
                                </Badge>
                            </TableCell>
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
                                {fee.status !== 'Paid' && (
                                    <DropdownMenuItem onClick={() => handleMarkAsPaid(fee.id!)}>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Mark as Paid
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleOpenDialog(fee)}>
                                    <Clock className="mr-2 h-4 w-4" />
                                    View/Edit
                                </DropdownMenuItem>
                                 <DropdownMenuItem onClick={() => handlePrint(fee)}>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Invoice
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingFee ? "Edit Invoice" : "Add New Invoice"}</DialogTitle>
                    <DialogDescription>
                        {editingFee ? "Update the details for the invoice." : "Enter details for the new fee invoice."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="invoiceNumber" className="text-right">Invoice #</Label>
                        <Input id="invoiceNumber" {...register("invoiceNumber")} className="col-span-3" readOnly />
                        {errors.invoiceNumber && <p className="col-span-4 text-destructive text-xs text-right">{errors.invoiceNumber.message}</p>}
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classId" className="text-right">Class</Label>
                        <Select onValueChange={(value) => {
                            setSelectedClass(value);
                            setValue('studentId', ''); // Reset student when class changes
                        }} defaultValue={selectedClass}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="studentId" className="text-right">Student</Label>
                        <Controller
                            control={control}
                            name="studentId"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentsInClass.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            )}
                        />
                        {errors.studentId && <p className="col-span-4 text-destructive text-xs text-right">{errors.studentId.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">Amount</Label>
                        <Input id="amount" type="number" {...register("amount")} className="col-span-3" />
                        {errors.amount && <p className="col-span-4 text-destructive text-xs text-right">{errors.amount.message}</p>}
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                        <Input id="dueDate" type="date" {...register("dueDate")} className="col-span-3" />
                        {errors.dueDate && <p className="col-span-4 text-destructive text-xs text-right">{errors.dueDate.message}</p>}
                    </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
            </Card>
        </div>
        {feeToPrint && (
            <div className="hidden print:block">
                <InvoicePrint fee={feeToPrint} studentName={studentMap.get(feeToPrint.studentId) || 'Unknown Student'} />
            </div>
        )}
    </>
  );
}
