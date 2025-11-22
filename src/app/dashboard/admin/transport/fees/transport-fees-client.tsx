'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { PlusCircle, MoreHorizontal, Edit, Trash2, IndianRupee, DollarSign, Users, Send } from 'lucide-react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { type TransportRoute, type StudentProfile } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';

const routeFeeSchema = z.object({
  id: z.string().optional(),
  routeId: z.string().min(1, 'Route is required'),
  fee: z.preprocess((val) => Number(val), z.number().min(0, 'Fee must be a positive number')),
  frequency: z.enum(['Monthly', 'Quarterly', 'Annually']),
});

type RouteFeeFormValues = z.infer<typeof routeFeeSchema>;

type RouteFee = RouteFeeFormValues & { id: string };

type StudentWithDue = StudentProfile & {
    routeId?: string;
    routeName?: string;
    dueAmount?: number;
}

type TransportFeesClientProps = {
  allRoutes: TransportRoute[];
  allStudents: StudentProfile[];
};

export function TransportFeesClient({ allRoutes, allStudents }: TransportFeesClientProps) {
  const { toast } = useToast();
  
  const initialFees = useMemo(() => allRoutes.map(r => ({
    id: `RF-${r.id}`,
    routeId: r.id,
    fee: r.fare,
    frequency: 'Monthly'
  } as RouteFee)), [allRoutes]);
  
  const [routeFees, setRouteFees] = useState<RouteFee[]>(initialFees);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<RouteFee | null>(null);
  
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentWithDue | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<RouteFeeFormValues>({
    resolver: zodResolver(routeFeeSchema),
  });

  const routeMap = useMemo(() => new Map(allRoutes.map(r => [r.id, r.name])), [allRoutes]);
  const routeFeeMap = useMemo(() => new Map(routeFees.map(rf => [rf.routeId, rf.fee])), [routeFees]);

  const studentsWithDues: StudentWithDue[] = useMemo(() => {
    return allStudents.map(student => {
      // Fake assignment for demo
      const routeId = student.id === 'S001' || student.id === 'S002' ? 'R01' : 'R02';
      const fee = routeFeeMap.get(routeId);
      return {
        ...student,
        routeId,
        routeName: routeMap.get(routeId),
        dueAmount: fee,
      }
    }).filter(s => s.dueAmount);
  }, [allStudents, routeMap, routeFeeMap]);

  const stats = useMemo(() => ({
    totalDue: studentsWithDues.reduce((sum, s) => sum + (s.dueAmount || 0), 0),
    totalDefaulters: studentsWithDues.length,
  }), [studentsWithDues]);

  const handleOpenDialog = (fee: RouteFee | null = null) => {
    setEditingFee(fee);
    if (fee) {
      reset(fee);
    } else {
      reset({ routeId: '', fee: 0, frequency: 'Monthly' });
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<RouteFeeFormValues> = (data) => {
    if (editingFee) {
      setRouteFees(routeFees.map(f => f.id === editingFee.id ? { ...f, ...data } : f));
      toast({ title: 'Success', description: 'Route fee updated.' });
    } else {
      const newFee = { ...data, id: `RF-${Date.now()}` };
      setRouteFees([...routeFees.filter(f => f.routeId !== data.routeId), newFee]);
      toast({ title: 'Success', description: 'New route fee added.' });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (feeId: string) => {
    setRouteFees(routeFees.filter(f => f.id !== feeId));
    toast({ variant: 'destructive', title: 'Deleted', description: 'Route fee has been removed.' });
  }

  const handleOpenReminderDialog = (student: StudentWithDue) => {
    setSelectedStudent(student);
    setIsReminderOpen(true);
  };

  const handleSendEmail = () => {
    if (!selectedStudent || !selectedStudent.dueAmount) return;
    
    const parentEmail = `parent.${selectedStudent.email.split('@')[0]}@example.com`;
    const subject = `Transport Fee Reminder for ${selectedStudent.name}`;
    const body = `
Dear ${selectedStudent.parentName},

This is a friendly reminder that the transport fee payment for ${selectedStudent.name} is outstanding.

Amount Due: $${selectedStudent.dueAmount.toLocaleString()}

Please make the payment at your earliest convenience.

Thank you,
Aedura Elite School
    `.trim().replace(/\n/g, '%0A');

    window.location.href = `mailto:${parentEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setIsReminderOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Transport Fee Due</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">${stats.totalDue.toLocaleString()}</div><p className="text-xs text-muted-foreground">This billing cycle</p></CardContent></Card>
        <Card className="glassmorphic"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Defaulters</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalDefaulters}</div><p className="text-xs text-muted-foreground">Students with pending fees</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card className="glassmorphic">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Route Fee Structure</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog()}><PlusCircle className="h-5 w-5" /></Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Route</TableHead><TableHead className="text-right">Fee</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {routeFees.map(fee => (
                                <TableRow key={fee.id}>
                                    <TableCell className="font-medium">{routeMap.get(fee.routeId) || 'N/A'}</TableCell>
                                    <TableCell className="text-right">${fee.fee.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => handleOpenDialog(fee)}><Edit className="mr-2 h-4 w-4"/>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(fee.id)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4"/>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Pending Fees List</CardTitle>
                    <CardDescription>Students with outstanding transport fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Class</TableHead><TableHead>Route</TableHead><TableHead>Amount Due</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {studentsWithDues.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-medium">{s.name}</TableCell>
                                    <TableCell>{s.class}-{s.section}</TableCell>
                                    <TableCell>{s.routeName}</TableCell>
                                    <TableCell><Badge variant="destructive">${s.dueAmount?.toLocaleString()}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="outline" onClick={() => handleOpenReminderDialog(s)}><Send className="h-3 w-3 mr-1.5"/> Reminder</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFee ? 'Edit Route Fee' : 'Add Route Fee'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Route</Label>
                <Controller name="routeId" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!editingFee}>
                    <SelectTrigger><SelectValue placeholder="Select Route"/></SelectTrigger>
                    <SelectContent>{allRoutes.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                  </Select>
                )}/>
                {errors.routeId && <p className="text-destructive text-xs">{errors.routeId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Fee Amount</Label>
                <Input type="number" {...register('fee')} placeholder="e.g., 2200"/>
                 {errors.fee && <p className="text-destructive text-xs">{errors.fee.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Controller name="frequency" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Frequency"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                )}/>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Fee</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

       <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Send Transport Fee Reminder</DialogTitle>
                <DialogDescription>
                    You are about to send a fee reminder to the parent of <span className="font-semibold">{selectedStudent?.name}</span>.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-sm bg-muted/50 rounded-md p-4 border">
                <h4 className="font-semibold mb-2">Email Preview:</h4>
                <p><strong>To:</strong> {selectedStudent && `parent.${selectedStudent.email.split('@')[0]}@example.com`}</p>
                <p><strong>Subject:</strong> Transport Fee Reminder for {selectedStudent?.name}</p>
                <hr className="my-2"/>
                <p>Dear {selectedStudent?.parentName},</p>
                <p className="mt-2">This is a friendly reminder that the transport fee payment of ${selectedStudent?.dueAmount?.toLocaleString()} for {selectedStudent?.name} is outstanding.</p>
                <p className="mt-2">Thank you.</p>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsReminderOpen(false)}>Cancel</Button>
                <Button onClick={handleSendEmail}><Send className="mr-2 h-4 w-4"/>Send Email</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
