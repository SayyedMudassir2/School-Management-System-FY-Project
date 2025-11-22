
'use client';

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import React from 'react';

type Fee = {
    id?: string;
    studentId: string;
    amount: number;
    dueDate: string;
    status: "Paid" | "Unpaid" | "Overdue";
    invoiceNumber: string;
};

type InvoicePrintProps = {
  fee: Fee;
  studentName: string;
};

export const InvoicePrint = React.forwardRef<HTMLDivElement, InvoicePrintProps>(({ fee, studentName }, ref) => {
  const today = new Date();

  return (
    <div ref={ref} className="bg-white text-black p-8 font-sans">
      <header className="flex justify-between items-center border-b-2 border-gray-200 pb-4">
        <div>
          <Logo />
          <p className="text-sm text-gray-600 mt-1">123 Education Lane, Knowledge City</p>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 uppercase tracking-wider">Invoice</h1>
      </header>

      <section className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-500">Billed To:</h2>
          <p className="text-lg font-bold">{studentName}</p>
          <p className="text-gray-600">Student ID: {fee.studentId}</p>
        </div>
        <div className="text-right">
          <div className="mb-2">
            <span className="text-sm font-semibold uppercase text-gray-500">Invoice Number: </span>
            <span className="font-medium">{fee.invoiceNumber}</span>
          </div>
          <div>
            <span className="text-sm font-semibold uppercase text-gray-500">Date of Issue: </span>
            <span className="font-medium">{format(today, "dd MMM yyyy")}</span>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold uppercase">Description</th>
              <th className="p-3 text-sm font-semibold uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3">School Fees - Academic Year 2024-2025</td>
              <td className="p-3 text-right">${fee.amount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="grid grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
            <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500">Payment Status</h2>
                <Badge variant={
                    fee.status === 'Paid' ? 'default' :
                    fee.status === 'Overdue' ? 'destructive' : 'secondary'
                } className={`mt-1 text-lg ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : fee.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {fee.status}
                </Badge>
            </div>
            <div>
                <h2 className="text-sm font-semibold uppercase text-gray-500">Due Date</h2>
                <p className="text-lg font-bold">{format(new Date(fee.dueDate), "dd MMM yyyy")}</p>
            </div>
        </div>
        <div className="text-right flex flex-col justify-end">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold uppercase text-gray-500">Total Amount Due</p>
            <p className="text-3xl font-bold tracking-tight">${fee.amount.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <footer className="mt-12 pt-4 border-t text-center text-sm text-gray-500">
        <p>Thank you for your payment.  If you have any questions, please contact our finance department at <a href="mailto:finance@aedura.elite" className="text-blue-600 underline">finance@aedura.elite</a>.</p>
        <p className="mt-1">Aedura Elite &copy; {format(today, "yyyy")}</p>
      </footer>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';

