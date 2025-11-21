'use client';

import { useState, useRef, ReactInstance } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IdCard, FileText, Printer } from 'lucide-react';
import { IdCardTemplate } from './id-card-template';
import { TcTemplate } from './tc-template';
import type { StudentProfile } from '@/lib/mock-data';

type CertificatesClientProps = {
  students: StudentProfile[];
};

export function CertificatesClient({ students }: CertificatesClientProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [dialogContent, setDialogContent] = useState<'id-card' | 'tc' | null>(null);

  const idCardRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handlePrintIdCard = useReactToPrint({
    content: () => idCardRef.current,
  });
  
  const handlePrintTc = useReactToPrint({
    content: () => tcRef.current,
  });

  const handleGenerate = (type: 'id-card' | 'tc') => {
    if (selectedStudent) {
      setDialogContent(type);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Hidden container for printing */}
      <div className="hidden">
        {selectedStudent && (
          <>
            <div ref={idCardRef}>
              <IdCardTemplate student={selectedStudent} />
            </div>
            <div ref={tcRef}>
              <TcTemplate student={selectedStudent} />
            </div>
          </>
        )}
      </div>

      <Card className="glassmorphic">
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
          <Button onClick={() => handleGenerate('id-card')} disabled={!selectedStudent}>
            <IdCard className="mr-2 h-4 w-4" /> Generate ID Card
          </Button>
          <Button onClick={() => handleGenerate('tc')} disabled={!selectedStudent} variant="secondary">
            <FileText className="mr-2 h-4 w-4" /> Generate TC
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={!!dialogContent} onOpenChange={(open) => !open && setDialogContent(null)}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
                {dialogContent === 'id-card' ? `ID Card for ${selectedStudent?.name}` : `Transfer Certificate for ${selectedStudent?.name}`}
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 max-h-[70vh] overflow-y-auto">
            {selectedStudent && (
                dialogContent === 'id-card' ? <IdCardTemplate student={selectedStudent} /> : <TcTemplate student={selectedStudent} />
            )}
          </div>
          <DialogFooter className="p-6 pt-0">
            <Button variant="ghost" onClick={() => setDialogContent(null)}>Close</Button>
            <Button onClick={dialogContent === 'id-card' ? handlePrintIdCard : handlePrintTc}>
              <Printer className="mr-2 h-4 w-4" /> Print / Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}