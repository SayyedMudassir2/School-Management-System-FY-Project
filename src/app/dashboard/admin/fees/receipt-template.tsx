
'use client';

import React from 'react';
import { format } from "date-fns";
import type { PaymentDetails } from '@/lib/mock-data';

export const ReceiptTemplate = React.forwardRef<HTMLDivElement, { details: PaymentDetails }>(({ details }, ref) => {
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
                    <p><span className="font-semibold uppercase text-gray-500">Receipt No:</span> {payment.receiptId}</p>
                    <p><span className="font-semibold uppercase text-gray-500">Payment Date:</span> {format(new Date(payment.paymentDate), 'dd MMM, yyyy')}</p>
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
