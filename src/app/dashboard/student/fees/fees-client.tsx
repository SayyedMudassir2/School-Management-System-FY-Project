
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Download, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { StudentProfile, Fee, PaymentDetails } from '@/lib/mock-data';

type FeesClientProps = {
    student: StudentProfile;
    fees: Fee[];
    receipts: PaymentDetails[];
};

export function FeesClient({ student, fees, receipts }: FeesClientProps) {
    const { toast } = useToast();

    const feeSummary = useMemo(() => {
        const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paid = receipts.reduce((sum, receipt) => sum + receipt.amountPaid, 0);
        const due = total - paid;
        return { total, paid, due, percentage: total > 0 ? (paid / total) * 100 : 100 };
    }, [fees, receipts]);

    const getStatusBadge = (status: Fee['status']) => {
        switch(status) {
            case 'Paid': return <Badge variant="default" className="bg-green-500/20 text-green-700 border-green-500/20">Paid</Badge>;
            case 'Unpaid': return <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 border-yellow-500/20">Unpaid</Badge>;
            case 'Overdue': return <Badge variant="destructive">Overdue</Badge>;
        }
    };

    const handlePayNow = () => {
        toast({
            title: "Redirecting to Payment Gateway...",
            description: "This is a placeholder for a real payment integration.",
        });
    };

    const handleDownloadReceipt = (receiptId: string) => {
        toast({
            title: "Downloading Receipt...",
            description: `Receipt ${receiptId} will be downloaded.`,
        });
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glassmorphic">
                    <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary"/>Total Fees</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">${feeSummary.total.toLocaleString()}</p></CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/>Amount Paid</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold">${feeSummary.paid.toLocaleString()}</p></CardContent>
                </Card>
                <Card className="glassmorphic">
                    <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-destructive"/>Amount Due</CardTitle></CardHeader>
                    <CardContent><p className="text-3xl font-bold text-destructive">${feeSummary.due.toLocaleString()}</p></CardContent>
                    {feeSummary.due > 0 && <CardFooter><Button onClick={handlePayNow}>Pay Now</Button></CardFooter>}
                </Card>
            </div>
             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Fee Overview</CardTitle>
                    <CardDescription>A breakdown of your fee invoices for the current session.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Due Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {fees.map(fee => (
                                <TableRow key={fee.id}>
                                    <TableCell>{fee.invoiceNumber}</TableCell>
                                    <TableCell>{format(new Date(fee.dueDate), 'dd MMM, yyyy')}</TableCell>
                                    <TableCell>${fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>{getStatusBadge(fee.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card className="glassmorphic">
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A log of all payments you have made.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader><TableRow><TableHead>Receipt ID</TableHead><TableHead>Payment Date</TableHead><TableHead>Amount Paid</TableHead><TableHead>Payment Mode</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {receipts.length > 0 ? receipts.map(receipt => (
                                <TableRow key={receipt.receiptId}>
                                    <TableCell>{receipt.receiptId}</TableCell>
                                    <TableCell>{format(new Date(receipt.paymentDate), 'dd MMM, yyyy')}</TableCell>
                                    <TableCell>${receipt.amountPaid.toLocaleString()}</TableCell>
                                    <TableCell><Badge variant="secondary">{receipt.paymentMode}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => handleDownloadReceipt(receipt.receiptId)}>
                                            <Download className="mr-2 h-4 w-4"/>Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={5} className="text-center h-24">No payment history found.</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
