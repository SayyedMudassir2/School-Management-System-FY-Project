'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Printer } from 'lucide-react';
import { type TransportRoute, type Vehicle, type TeacherProfile, type StudentProfile } from '@/lib/mock-data';

type StudentAssignment = {
    studentId: string;
    routeId: string;
    stopName: string;
};

type ReportsClientProps = {
  allRoutes: TransportRoute[];
  allVehicles: Vehicle[];
  allDrivers: TeacherProfile[];
  allStudents: StudentProfile[];
  assignments: StudentAssignment[];
};

type ReportData = {
    routeName: string;
    vehicleNo: string;
    driver: string;
    totalStudents: number;
    students: {
        serialNo: number;
        studentName: string;
        admissionNo: string;
        class: string;
        section: string;
        stop: string;
        pickupTime: string;
        parentPhone: string;
    }[];
} | null;

export function ReportsClient({
  allRoutes,
  allVehicles,
  allDrivers,
  allStudents,
  assignments,
}: ReportsClientProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };

  const reportData: ReportData = useMemo(() => {
    if (!selectedRouteId) return null;

    const route = allRoutes.find(r => r.id === selectedRouteId);
    if (!route) return null;

    const vehicle = allVehicles.find(v => v.id === route.vehicleId);
    const driver = allDrivers.find(d => d.id === route.driverId);

    const assignedStudentIds = assignments
      .filter(a => a.routeId === selectedRouteId)
      .map(a => a.studentId);
    
    const studentsOnRoute = allStudents
      .filter(s => assignedStudentIds.includes(s.id))
      .map((student, index) => {
        const assignment = assignments.find(a => a.studentId === student.id);
        const stop = route.stops.find(st => st.name === assignment?.stopName);
        return {
          serialNo: index + 1,
          studentName: student.name,
          admissionNo: student.admissionNo,
          class: student.class,
          section: student.section,
          stop: assignment?.stopName || 'N/A',
          pickupTime: stop?.time || 'N/A',
          parentPhone: student.parentContact,
        };
      });

    return {
      routeName: route.name,
      vehicleNo: vehicle?.number || 'N/A',
      driver: driver?.name || 'N/A',
      totalStudents: studentsOnRoute.length,
      students: studentsOnRoute,
    };
  }, [selectedRouteId, allRoutes, allVehicles, allDrivers, allStudents, assignments]);

  return (
    <>
      <div className="non-printable">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Route-wise Student Register</CardTitle>
            <CardDescription>Select a route to generate the student register.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-80">
              <label className="text-sm font-medium">Route</label>
              <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                <SelectTrigger><SelectValue placeholder="Select a route" /></SelectTrigger>
                <SelectContent>
                  {allRoutes.map(route => <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handlePrint} disabled={!reportData}>
                <Printer className="mr-2 h-4 w-4" /> Print Register
            </Button>
          </CardContent>
        </Card>
      </div>

      {reportData && (
        <div ref={printRef} className="printable-area mt-8">
          <Card>
            <CardHeader className="text-center border-b pb-4">
              <h2 className="text-2xl font-bold">Aedura Elite School</h2>
              <h3 className="text-xl font-semibold">Transport Register - Route-wise Students</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-4 text-sm mb-4 p-2 bg-muted/50 rounded-md">
                <p><strong>Route:</strong> {reportData.routeName}</p>
                <p><strong>Vehicle:</strong> {reportData.vehicleNo}</p>
                <p><strong>Driver:</strong> {reportData.driver}</p>
                <p><strong>Total Students:</strong> {reportData.totalStudents}</p>
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Adm. No.</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Stop</TableHead>
                      <TableHead>Pickup Time</TableHead>
                      <TableHead>Parent Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.students.map(s => (
                      <TableRow key={s.serialNo}>
                        <TableCell>{s.serialNo}</TableCell>
                        <TableCell>{s.studentName}</TableCell>
                        <TableCell>{s.admissionNo}</TableCell>
                        <TableCell>{s.class}-{s.section}</TableCell>
                        <TableCell>{s.stop}</TableCell>
                        <TableCell>{s.pickupTime}</TableCell>
                        <TableCell>{s.parentPhone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
