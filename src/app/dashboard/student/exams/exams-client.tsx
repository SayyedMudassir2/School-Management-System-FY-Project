
'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Printer } from "lucide-react";
import { ReportCardTemplate } from './report-card-template';

const mockExamResults = {
    'Term 1': [
        { subject: 'Mathematics', marks: 85, total: 100, grade: 'A' },
        { subject: 'Physics', marks: 78, total: 100, grade: 'B' },
        { subject: 'Chemistry', marks: 92, total: 100, grade: 'A+' },
        { subject: 'Biology', marks: 88, total: 100, grade: 'A' },
        { subject: 'English', marks: 90, total: 100, grade: 'A+' },
        { subject: 'History', marks: 81, total: 100, grade: 'A' },
    ],
    'Term 2': [
        { subject: 'Mathematics', marks: 90, total: 100, grade: 'A+' },
        { subject: 'Physics', marks: 82, total: 100, grade: 'A' },
        { subject: 'Chemistry', marks: 88, total: 100, grade: 'A' },
        { subject: 'Biology', marks: 91, total: 100, grade: 'A+' },
        { subject: 'English', marks: 85, total: 100, grade: 'A' },
        { subject: 'History', marks: 89, total: 100, grade: 'A' },
    ],
};

const chartConfig = {
    marks: {
      label: "Marks",
      color: "hsl(var(--primary))",
    },
};

export function ExamsClient() {
    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const printRef = useRef<HTMLDivElement>(null);

    const examData = mockExamResults[selectedTerm as keyof typeof mockExamResults];
    
    const summary = useMemo(() => {
        if (!examData) return { totalMarks: 0, percentage: 0, result: 'N/A' };
        const totalMarks = examData.reduce((sum, sub) => sum + sub.marks, 0);
        const maxMarks = examData.reduce((sum, sub) => sum + sub.total, 0);
        const percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
        const result = percentage >= 40 ? 'Pass' : 'Fail';
        return { totalMarks, percentage, result };
    }, [examData]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .printable-area, .printable-area * {
                        visibility: visible;
                    }
                    .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white;
                    }
                    .non-printable {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="space-y-8">
                <div className="flex gap-2 non-printable">
                    {Object.keys(mockExamResults).map(term => (
                        <Button
                            key={term}
                            variant={selectedTerm === term ? 'default' : 'outline'}
                            onClick={() => setSelectedTerm(term)}
                        >
                            {term}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle>{selectedTerm} Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Total</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {examData.map(result => (
                                            <TableRow key={result.subject}>
                                                <TableCell className="font-medium">{result.subject}</TableCell>
                                                <TableCell>{result.marks}</TableCell>
                                                <TableCell>{result.total}</TableCell>
                                                <TableCell className="font-semibold">{result.grade}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-8">
                         <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle>Performance Graph</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                    <BarChart data={examData} layout="vertical" margin={{ left: 10, right: 20 }}>
                                        <XAxis type="number" domain={[0, 100]} />
                                        <YAxis dataKey="subject" type="category" width={70} tick={{ fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} content={<ChartTooltipContent />} />
                                        <Bar dataKey="marks" fill="var(--color-marks)" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                         <Card className="glassmorphic">
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center space-y-2">
                                <p className="text-sm text-muted-foreground">Overall Percentage</p>
                                <p className="text-4xl font-bold">{summary.percentage.toFixed(2)}%</p>
                                <p className={`text-lg font-semibold ${summary.result === 'Pass' ? 'text-green-500' : 'text-red-500'}`}>{summary.result}</p>
                            </CardContent>
                            <CardFooter className="non-printable">
                                <Button className="w-full" onClick={handlePrint}><Printer className="mr-2 h-4 w-4"/> Download Report Card</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
            
            <div className="hidden">
                 <div ref={printRef}>
                    <ReportCardTemplate
                        term={selectedTerm}
                        results={examData}
                        summary={summary}
                    />
                </div>
            </div>
        </>
    );
}

