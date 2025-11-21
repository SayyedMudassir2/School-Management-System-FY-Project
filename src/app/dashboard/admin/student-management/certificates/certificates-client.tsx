'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactToPrint from 'react-to-print';
import { IdCard, FileText } from 'lucide-react';
import { IdCardTemplate } from './id-card-template';
import { TcTemplate } from './tc-template';
import type { StudentProfile } from '@/lib/mock-data';

type CertificatesClientProps = {
  students: StudentProfile[];
};

export function CertificatesClient({ students }: CertificatesClientProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  
  const idCardRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLDivElement>(null);

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <>
      <div style={{ display: 'none' }}>
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
          <ReactToPrint
            trigger={() => (
              <Button disabled={!selectedStudent}>
                <IdCard className="mr-2 h-4 w-4" /> Generate & Print ID Card
              </Button>
            )}
            content={() => idCardRef.current}
          />
          <ReactToPrint
            trigger={() => (
              <Button disabled={!selectedStudent} variant="secondary">
                <FileText className="mr-2 h-4 w-4" /> Generate & Print TC
              </Button>
            )}
            content={() => tcRef.current}
          />
        </CardFooter>
      </Card>
    </>
  );
}
