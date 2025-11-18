"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAttendanceInsights, type AttendanceInsightsOutput } from "@/ai/flows/attendance-insights";
import { mockAttendanceRecords } from "@/lib/mock-data";
import { Rocket, FileText, UserX, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Class = { id: string; name: string };
type Student = { id: string, name: string };

type AttendanceClientProps = {
  classes: Class[];
  students: Student[];
};

export function AttendanceClient({ classes, students }: AttendanceClientProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [insights, setInsights] = useState<AttendanceInsightsOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const studentMap = new Map(students.map(s => [s.id, s.name]));

  const handleGenerate = async () => {
    if (!selectedClass) {
      setError("Please select a class first.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setInsights(null);

    try {
      // In a real app, you would fetch records for the selectedClass
      const result = await getAttendanceInsights({
        attendanceRecords: mockAttendanceRecords,
        classDetails: `Class: ${selectedClass}`,
      });
      setInsights(result);
    } catch (e) {
      setError("Failed to generate insights.  Please try again.");
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>
          Select a class to generate an AI-powered attendance analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleGenerate} disabled={isGenerating || !selectedClass} className="w-full sm:w-auto">
          <Rocket className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate Insights"}
        </Button>
      </CardContent>
      {error && <CardFooter><p className="text-sm text-destructive">{error}</p></CardFooter>}

      {isGenerating && <ReportSkeleton />}

      {insights && (
        <CardContent className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Attendance Report for Class {selectedClass}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserX className="h-5 w-5" />Potential Truancy</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-right">Absences</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights.potentialTruancy.length > 0 ? (
                      insights.potentialTruancy.map((student) => (
                        <TableRow key={student.studentId}>
                          <TableCell className="font-medium">{studentMap.get(student.studentId) || student.studentId}</TableCell>
                          <TableCell className="text-right text-destructive font-bold">{student.numberOfAbsences}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground">No significant truancy patterns detected.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{insights.overallAttendanceTrend}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5 text-accent"/>Suggested Interventions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-line">{insights.suggestedInterventions}</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

const ReportSkeleton = () => (
    <CardContent className="space-y-6">
      <Skeleton className="h-8 w-1/2" />
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  );
