'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IdCard, FileText } from 'lucide-react';
import { IdCardTemplate } from './id-card-template';
import { TcTemplate } from './tc-template';
import type { StudentProfile } from '@/lib/mock-data';

type CertificatesClientProps = {
  students: StudentProfile[];
};

type PrintableDocument = 'idCard' | 'tc' | null;

export function CertificatesClient({ students }: CertificatesClientProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [printableDoc, setPrintableDoc] = useState<PrintableDocument>(null);
  
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // This effect will run after the state has been updated and the component has re-rendered.
  useEffect(() => {
    if (printableDoc && selectedStudent) {
      window.print();
      // Reset the printable doc so it doesn't print again on re-renders.
      setPrintableDoc(null);
    }
  }, [printableDoc, selectedStudent]);

  const handlePrint = (docType: PrintableDocument) => {
    if (!selectedStudent) return;
    // This just sets the state. The useEffect hook will handle the printing.
    setPrintableDoc(docType);
  };


  return (
    <>
      <div className="printable-area">
        {selectedStudent && printableDoc === 'idCard' && <IdCardTemplate student={selectedStudent} />}
        {selectedStudent && printableDoc === 'tc' && <TcTemplate student={selectedStudent} />}
      </div>

      <Card className="glassmorphic non-printable">
        <CardHeader>
          <CardTitle>Document Generator</CardTitle>
          <CardDescription>Select a student to generate an ID card or a Transfer Certificate.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <label className="text-sm font-medium">Student</label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger>
              <SelectContent>
                {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name} - {s.admissionNo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="gap-4">
          <Button disabled={!selectedStudent} onClick={() => handlePrint('idCard')}>
            <IdCard className="mr-2 h-4 w-4" /> Generate & Print ID Card
          </Button>
          <Button disabled={!selectedStudent} variant="secondary" onClick={() => handlePrint('tc')}>
            <FileText className="mr-2 h-4 w-4" /> Generate & Print TC
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
