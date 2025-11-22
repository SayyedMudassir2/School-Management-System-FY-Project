
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, User, Banknote, Calendar, Hash, Receipt, Printer, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { studentDirectory, type Fee, type StudentProfile } from "@/lib/mock-data";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type CollectFeesClientProps = {
  students: StudentProfile[];
  initialFees: Fee[];
};

type PaymentDetails = {
    invoiceNumber: string;
    totalAmount: number;
    amountPaid: number;
    discount: number;
    fine: number;
    paymentMode: string;
    student: StudentProfile;
    fee: Fee;
};

export function CollectFeesClient({ students: allStudents, initialFees }: CollectFeesClientProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
  const [fees, setFees] = useState<Fee[]>(initialFees);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [fine, setFine] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<PaymentDetails | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const [printableDoc, setPrintableDoc] = useState<PaymentDetails | null>(null);

  useEffect(() => {
    if (printableDoc) {
      window.print();
      setPrintableDoc(null);
    }
  }, [printableDoc]);

  const handlePrint = () => {
    setPrintableDoc(receiptDetails);
  };
  
  const filteredStudents = useMemo(() => {
    if (!searchTerm) return [];
    return allStudents.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, allStudents]);

  const studentFee = useMemo(() => {
    if (!selectedStudent) return null;
    return fees.find(f => f.studentId === selectedStudent.id);
  }, [selectedStudent, fees]);

  const handleSelectStudent = (student: StudentProfile) => {
    setSelectedStudent(student);
    const fee = fees.find(f => f.studentId === student.id);
    if (fee) {
      setPaymentAmount(fee.amount);
      if (fee.status === 'Overdue') {
        setFine(50); // Auto-calculate fine
      } else {
        setFine(0);
      }
    }
    setSearchTerm('');
  };

  const handleProcessPayment = () => {
    if (!selectedStudent || !studentFee) return;

    const finalAmountPaid = paymentAmount + fine - discount;

    const newReceipt: PaymentDetails = {
        invoiceNumber: studentFee.invoiceNumber,
        totalAmount: studentFee.amount + fine,
        amountPaid: finalAmountPaid,
        discount,
        fine,
        paymentMode,
        student: selectedStudent,
        fee: studentFee
    };

    setReceiptDetails(newReceipt);

    // Update fee status
    setFees(fees.map(f => f.id === studentFee.id ? { ...f, status: 'Paid' } : f));
    
    toast({
        title: "Payment Successful",
        description: `Recorded payment of $${finalAmountPaid.toLocaleString()} for ${selectedStudent.name}.`,
    });
    
    setIsReceiptOpen(true);
    // Reset form
    setSelectedStudent(null);
    setPaymentAmount(0);
    setDiscount(0);
    setFine(0);
  };

  const getStatusBadge = (status: Fee['status']) => {
    switch(status) {
      case 'Paid': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Paid</Badge>;
      case 'Unpaid': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">Unpaid</Badge>;
      case 'Overdue': return <Badge variant="destructive" className="bg-red-500/20 text-red-700 border-red-500/20">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <div className="printable-area">
        {printableDoc && (
          <ReceiptTemplate
            details={printableDoc}
          />
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start non-printable">
        <div className="lg:col-span-1">
          <Card className="glassmorphic">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" /> Find Student</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder="Search by name, admission no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredStudents.length > 0 && (
                  <Card className="absolute top-full mt-2 w-full z-10">
                    <CardContent className="p-2">
                      {filteredStudents.map(student => (
                        <div key={student.id} onClick={() => handleSelectStudent(student)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer">
                          <Avatar>
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.admissionNo}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedStudent && studentFee ? (
            <Card className="glassmorphic animate-in fade-in duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.avatar} />
                    <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{selectedStudent.name}</CardTitle>
                    <CardDescription>{selectedStudent.admissionNo} | {selectedStudent.class}-{selectedStudent.section}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Pending Invoice</h3>
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Invoice #{studentFee.invoiceNumber}</span>
                      {getStatusBadge(studentFee.status)}
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Due</span>
                      <span>${studentFee.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Due Date: {format(new Date(studentFee.dueDate), "dd MMM, yyyy")}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                    <h3 className="font-semibold">Payment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="paymentAmount">Amount to Pay</Label>
                            <Input id="paymentAmount" type="number" value={paymentAmount} onChange={e => setPaymentAmount(Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label htmlFor="paymentMode">Payment Mode</Label>
                            <Select value={paymentMode} onValueChange={setPaymentMode}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Cash">Cash</SelectItem>
                                    <SelectItem value="Cheque">Cheque</SelectItem>
                                    <SelectItem value="UPI">UPI</SelectItem>
                                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="discount">Discount (-)</Label>
                            <Input id="discount" type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="fine">Late Fine (+)</Label>
                            <Input id="fine" type="number" value={fine} onChange={e => setFine(Number(e.target.value))} />
                        </div>
                    </div>
                     <div className="bg-muted/50 rounded-lg p-4 text-right">
                        <p className="text-sm text-muted-foreground">Total Payable</p>
                        <p className="text-2xl font-bold">${(paymentAmount + fine - discount).toLocaleString()}</p>
                    </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleProcessPayment}>Process Payment</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="glassmorphic h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <User className="mx-auto h-12 w-12 mb-4" />
                <p>Search for a student to begin collecting fees.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
      
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Payment Successful</DialogTitle>
                <DialogDescription>Receipt generated for the transaction.</DialogDescription>
            </DialogHeader>
            {receiptDetails && (
              <div className="max-h-[60vh] overflow-y-auto my-4 border rounded-lg">
                <ReceiptTemplate ref={receiptRef} details={receiptDetails} />
              </div>
            )}
            <DialogFooter className="sm:justify-between">
                <div className="flex gap-2">
                    <Button variant="outline"><Send className="h-4 w-4 mr-2" />Email to Parent</Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setIsReceiptOpen(false)}>Close</Button>
                    <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2"/>Print Receipt</Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const ReceiptTemplate = React.forwardRef<HTMLDivElement, { details: PaymentDetails }>(({ details }, ref) => {
    const { student, fee, ...payment } = details;
    return (
        <div ref={ref} className="bg-white text-black p-6 font-sans text-sm">
            <header className="flex justify-between items-center border-b pb-4">
                <div>
                    <h2 className="text-2xl font-bold">Aedura Elite</h2>
                    <p className="text-gray-500">123 Education Lane, Knowledge City</p>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 uppercase">Payment Receipt</h1>
            </header>
            <section className="grid grid-cols-2 gap-4 mt-6 text-xs">
                <div>
                    <p className="font-semibold uppercase text-gray-500">Billed To</p>
                    <p className="font-bold">{student.name}</p>
                    <p>{student.admissionNo}</p>
                    <p>{student.class}-{student.section}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-semibold uppercase text-gray-500">Receipt No:</span> RPT-{Date.now()}</p>
                    <p><span className="font-semibold uppercase text-gray-500">Payment Date:</span> {format(new Date(), 'dd MMM, yyyy')}</p>
                    <p><span className="font-semibold uppercase text-gray-500">Invoice No:</span> {fee.invoiceNumber}</p>
                </div>
            </section>
            <section className="mt-6">
                <table className="w-full text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 font-semibold uppercase">Description</th>
                            <th className="p-2 font-semibold uppercase text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b"><td className="p-2">Tuition & Fees</td><td className="p-2 text-right">${fee.amount.toLocaleString()}</td></tr>
                        {payment.fine > 0 && <tr className="border-b"><td className="p-2">Late Fine</td><td className="p-2 text-right">${payment.fine.toLocaleString()}</td></tr>}
                        {payment.discount > 0 && <tr className="border-b"><td className="p-2">Discount</td><td className="p-2 text-right">-${payment.discount.toLocaleString()}</td></tr>}
                    </tbody>
                    <tfoot>
                         <tr className="font-bold"><td className="p-2 text-right">Total Amount</td><td className="p-2 text-right">${(fee.amount + payment.fine - payment.discount).toLocaleString()}</td></tr>
                         <tr className="font-bold bg-gray-100"><td className="p-2 text-right">Amount Paid ({payment.paymentMode})</td><td className="p-2 text-right">${payment.amountPaid.toLocaleString()}</td></tr>
                    </tfoot>
                </table>
            </section>
             <footer className="mt-6 pt-4 border-t text-center text-xs text-gray-500">
                <p>This is a computer-generated receipt and does not require a signature.</p>
            </footer>
        </div>
    );
});
ReceiptTemplate.displayName = "ReceiptTemplate";
