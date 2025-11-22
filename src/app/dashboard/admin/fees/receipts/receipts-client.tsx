
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Printer, Send, MoreHorizontal, Calendar as CalendarIcon, AlertCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { studentDirectory, type StudentProfile, type PaymentDetails, classes as allClasses } from "@/lib/mock-data";
import { format, isWithinInterval } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { ReceiptTemplate } from '../receipt-template';

type ReceiptsClientProps = {
  initialReceipts: PaymentDetails[];
  students: StudentProfile[];
  classes: { id: string, name: string }[];
};

export function ReceiptsClient({ initialReceipts, students, classes }: ReceiptsClientProps) {
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<PaymentDetails[]>(initialReceipts);
  const [printableDoc, setPrintableDoc] = useState<PaymentDetails | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentDetails | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [classFilter, setClassFilter] = useState('all');
  const [paymentModeFilter, setPaymentModeFilter] = useState('all');

  useEffect(() => {
    const newReceiptData = sessionStorage.getItem('feeReceipts');
    if (newReceiptData) {
        try {
            const newReceipts = JSON.parse(newReceiptData);
            setReceipts(prev => [...newReceipts, ...prev]);
            sessionStorage.removeItem('feeReceipts');
        } catch (e) { console.error(e) }
    }
  }, []);

  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      const student = receipt.student;
      const matchesSearch = searchTerm === '' || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        receipt.receiptId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateRange || !dateRange.from || (dateRange.from && isWithinInterval(new Date(receipt.paymentDate), { start: dateRange.from, end: dateRange.to || dateRange.from }));
      
      const studentClassId = allClasses.find(c => c.name === `${student.class}-${student.section}`)?.id;
      const matchesClass = classFilter === 'all' || studentClassId === classFilter;

      const matchesPaymentMode = paymentModeFilter === 'all' || receipt.paymentMode === paymentModeFilter;

      return matchesSearch && matchesDate && matchesClass && matchesPaymentMode;
    });
  }, [receipts, searchTerm, dateRange, classFilter, paymentModeFilter]);

  useEffect(() => {
    if (printableDoc) {
      window.print();
      setPrintableDoc(null);
    }
  }, [printableDoc]);

  const handlePrint = (receipt: PaymentDetails) => {
    setPrintableDoc(receipt);
  };
  
  const handleView = (receipt: PaymentDetails) => {
    setSelectedReceipt(receipt);
    setIsViewOpen(true);
  };

  const handleCancelReceipt = () => {
    if (!selectedReceipt) return;
    // In a real app, this would also update the fee status and handle refunds.
    setReceipts(receipts.filter(r => r.receiptId !== selectedReceipt.receiptId));
    toast({
        variant: 'destructive',
        title: 'Receipt Cancelled',
        description: `Receipt ${selectedReceipt.receiptId} has been cancelled.`,
    });
    setIsCancelOpen(false);
    setSelectedReceipt(null);
  }

  const paymentModes = ["Cash", "Cheque", "UPI", "Bank Transfer"];

  return (
    <>
      <div className="printable-area">
        {printableDoc && <ReceiptTemplate details={printableDoc} />}
      </div>
      <Card className="glassmorphic non-printable">
        <CardHeader>
          <CardTitle>Receipts List</CardTitle>
          <CardDescription>Search and filter through all fee payment receipts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
             <Input 
                placeholder="Search name or receipt no..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:col-span-2"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
               <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
                  <SelectTrigger><SelectValue placeholder="Filter by payment mode" /></SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all">All Modes</SelectItem>
                      {paymentModes.map(mode => <SelectItem key={mode} value={mode}>{mode}</SelectItem>)}
                  </SelectContent>
              </Select>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receipt No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length > 0 ? filteredReceipts.map(receipt => (
                  <TableRow key={receipt.receiptId}>
                    <TableCell className="font-medium">{receipt.receiptId}</TableCell>
                    <TableCell>{receipt.student.name}</TableCell>
                    <TableCell>{receipt.student.class}-{receipt.student.section}</TableCell>
                    <TableCell>{format(new Date(receipt.paymentDate), 'dd MMM, yyyy')}</TableCell>
                    <TableCell>${receipt.amountPaid.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="secondary">{receipt.paymentMode}</Badge></TableCell>
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
                            <DropdownMenuItem onClick={() => handleView(receipt)}>
                              <Search className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handlePrint(receipt)}>
                              <Printer className="mr-2 h-4 w-4" /> Print
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => { setSelectedReceipt(receipt); setIsCancelOpen(true); }}
                            >
                              <XCircle className="mr-2 h-4 w-4" /> Cancel Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No receipts found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* View Receipt Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Receipt Details</DialogTitle>
                <DialogDescription>Details for receipt #{selectedReceipt?.receiptId}</DialogDescription>
            </DialogHeader>
            {selectedReceipt && (
              <div className="max-h-[60vh] overflow-y-auto my-4 border rounded-lg">
                <ReceiptTemplate details={selectedReceipt} />
              </div>
            )}
            <DialogFooter className="sm:justify-end">
                <Button variant="ghost" onClick={() => setIsViewOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Cancel Receipt Alert Dialog */}
      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel receipt <span className="font-semibold">{selectedReceipt?.receiptId}</span>. This may also require a manual refund entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelReceipt}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
