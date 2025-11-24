
'use client';

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import React from 'react';

type Result = {
    subject: string;
    marks: number;
    total: number;
    grade: string;
};

type Summary = {
    totalMarks: number;
    percentage: number;
    result: string;
};

type ReportCardTemplateProps = {
  term: string;
  results: Result[];
  summary: Summary;
};

export const ReportCardTemplate = React.forwardRef<HTMLDivElement, ReportCardTemplateProps>(({ term, results, summary }, ref) => {
  const issueDate = new Date();
  const totalMaxMarks = results.reduce((sum, r) => sum + r.total, 0);

  return (
    <div ref={ref} className="p-8 bg-white text-black font-sans text-sm" style={{ width: '210mm', minHeight: '297mm', margin: 'auto' }}>
      <header className="flex justify-between items-center border-b-4 border-primary pb-4">
        <Logo />
        <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800">PROGRESS REPORT</h1>
            <p className="text-lg font-semibold text-gray-600">{term}</p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-8 mt-8 text-base">
        <div>
          <p><strong className="w-24 inline-block">Student:</strong> John Doe</p>
          <p><strong className="w-24 inline-block">Class:</strong> 10-A</p>
        </div>
        <div className="text-right">
          <p><strong className="w-32 inline-block">Admission No:</strong> AD1234</p>
          <p><strong className="w-32 inline-block">Date of Issue:</strong> {format(issueDate, "dd MMM yyyy")}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-center">Academic Performance</h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-[50px]">S.No.</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Max Marks</TableHead>
              <TableHead className="text-center">Marks Obtained</TableHead>
              <TableHead className="text-center">Grade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((item, index) => (
              <TableRow key={item.subject}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{item.subject}</TableCell>
                <TableCell className="text-center">{item.total}</TableCell>
                <TableCell className="text-center font-semibold">{item.marks}</TableCell>
                <TableCell className="text-center font-bold">{item.grade}</TableCell>
              </TableRow>
            ))}
             <TableRow className="bg-gray-100 font-bold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-center">{totalMaxMarks}</TableCell>
                <TableCell className="text-center">{summary.totalMarks}</TableCell>
                <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

       <section className="mt-8 grid grid-cols-3 gap-8">
            <div className="col-span-2">
                <h3 className="font-semibold mb-2">Teacher's Remarks</h3>
                <div className="h-24 border-b border-dotted"></div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">Overall Percentage</p>
                <p className="text-4xl font-bold my-1">{summary.percentage.toFixed(2)}%</p>
                <Badge className={`text-lg ${summary.result === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{summary.result}</Badge>
            </div>
       </section>

      <footer className="mt-16 grid grid-cols-2 gap-8 text-center font-semibold">
        <div>
            <div className="h-12 border-b border-dotted"></div>
            <p>Parent's Signature</p>
        </div>
        <div>
            <div className="h-12 border-b border-dotted"></div>
            <p>Principal's Signature</p>
        </div>
      </footer>
       <div className="absolute bottom-4 left-8 right-8 text-center text-xs text-gray-400">
        Aedura Elite School - Educating the Future
      </div>
    </div>
  );
});
ReportCardTemplate.displayName = 'ReportCardTemplate';

