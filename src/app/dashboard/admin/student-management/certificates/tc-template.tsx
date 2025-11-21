
'use client';

import { Logo } from "@/components/logo";
import type { StudentProfile } from "@/lib/mock-data";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TcTemplateProps = {
  student: StudentProfile;
};

export function TcTemplate({ student }: TcTemplateProps) {
  const issueDate = new Date();

  return (
    <div className="p-8 bg-white text-black font-serif text-base" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto' }}>
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
            <Logo />
        </div>
        <h1 className="text-4xl font-bold tracking-wider text-gray-800">Transfer Certificate</h1>
        <p className="text-gray-600 mt-1">Academic Year {issueDate.getFullYear()}-{issueDate.getFullYear()+1}</p>
      </div>

      <div className="space-y-6 text-lg">
        <p>This is to certify that <strong className="border-b border-dotted border-black px-2">{student.name}</strong>, son/daughter of <strong className="border-b border-dotted border-black px-2">{student.parentName}</strong>, was a bonafide student of this school.</p>
        
        <table className="w-full">
            <tbody>
                <tr className="border-b"><td className="py-2 pr-4">Admission Number:</td><td className="font-semibold">{student.admissionNo}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Date of Birth:</td><td className="font-semibold">{format(new Date(student.dateOfBirth), 'dd MMMM yyyy')}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Class at time of leaving:</td><td className="font-semibold">{student.class} - {student.section}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4">Date of Admission:</td><td className="font-semibold">{/* Placeholder */}</td></tr>
                <tr><td className="py-2 pr-4">Date of Leaving:</td><td className="font-semibold">{format(issueDate, 'dd MMMM yyyy')}</td></tr>
            </tbody>
        </table>

        <div className="space-y-2">
            <Label htmlFor="reason">Reason for leaving:</Label>
            <Input id="reason" placeholder="e.g., Parent's transfer, personal reasons" className="text-lg border-b border-dotted border-black rounded-none p-1 bg-transparent" />
        </div>
        
        <p>The student has paid all dues to the school and has a <strong className="border-b border-dotted border-black px-2">Good</strong> moral character.</p>
        
        <p>We wish him/her all the best for their future endeavors.</p>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-8">
        <div>
            <p className="font-semibold">Date of Issue: {format(issueDate, 'dd MMMM yyyy')}</p>
        </div>
        <div className="text-right">
            <div className="w-48 h-12 border-b border-dotted border-black mx-auto"></div>
            <p className="mt-2 font-semibold">Principal's Signature</p>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-500">
        <p>123 Education Lane, Knowledge City | contact@aedura.elite | www.aedura.elite</p>
      </div>
    </div>
  );
}
