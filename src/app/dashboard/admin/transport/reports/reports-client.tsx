
'use client';

import { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Printer } from 'lucide-react';
import { type TransportRoute, type Vehicle, type TeacherProfile, type StudentProfile } from '@/lib/mock-data';
import { classes } from '@/lib/mock-data';

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

type RouteReportData = {
    reportType: 'route';
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
};

type VehicleReportData = {
    reportType: 'vehicle';
    vehicleNo: string;
    routeName: string;
    driver: string;
    totalStudents: number;
    students: {
        serialNo: number;
        studentName: string;
        admissionNo: string;
        class: string;
        section: string;
        stop: string;
    }[];
};

type ClassReportData = {
    reportType: 'class';
    className: string;
    totalStudents: number;
    students: {
        serialNo: number;
        studentName: string;
        admissionNo: string;
        route: string;
        stop: string;
    }[];
};


type ReportData = RouteReportData | VehicleReportData | ClassReportData | null;

export function ReportsClient({
  allRoutes,
  allVehicles,
  allDrivers,
  allStudents,
  assignments,
}: ReportsClientProps) {
  const [activeTab, setActiveTab] = useState('route');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const printRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };

  const routeMap = useMemo(() => new Map(allRoutes.map(r => [r.id, r])), [allRoutes]);
  const vehicleMap = useMemo(() => new Map(allVehicles.map(v => [v.id, v])), [allVehicles]);
  const driverMap = useMemo(() => new Map(allDrivers.map(d => [d.id, d.name])), [allDrivers]);
  const studentMap = useMemo(() => new Map(allStudents.map(s => [s.id, s])), [allStudents]);

  const reportData: ReportData = useMemo(() => {
    switch (activeTab) {
      case 'route':
        if (!selectedRouteId) return null;
        const route = routeMap.get(selectedRouteId);
        if (!route) return null;
        const vehicle = vehicleMap.get(route.vehicleId);
        const driver = driverMap.get(route.driverId);
        const studentsOnRoute = assignments
          .filter(a => a.routeId === selectedRouteId)
          .map((assignment, index) => {
            const student = studentMap.get(assignment.studentId);
            const stop = route.stops.find(st => st.name === assignment.stopName);
            return {
              serialNo: index + 1,
              studentName: student?.name || 'N/A',
              admissionNo: student?.admissionNo || 'N/A',
              class: student?.class || 'N/A',
              section: student?.section || 'N/A',
              stop: assignment.stopName,
              pickupTime: stop?.time || 'N/A',
              parentPhone: student?.parentContact || 'N/A',
            };
          });
        return {
          reportType: 'route',
          routeName: route.name,
          vehicleNo: vehicle?.number || 'N/A',
          driver: driver || 'N/A',
          totalStudents: studentsOnRoute.length,
          students: studentsOnRoute,
        };

      case 'vehicle':
        if (!selectedVehicleId) return null;
        const selectedVehicle = vehicleMap.get(selectedVehicleId);
        if (!selectedVehicle) return null;
        const assignedRoute = allRoutes.find(r => r.vehicleId === selectedVehicleId);
        if (!assignedRoute) return null;

        const stopOrder = new Map(assignedRoute.stops.map((stop, index) => [stop.name, index]));
        const studentsOnVehicle = assignments
          .filter(a => a.routeId === assignedRoute.id)
          .map(a => ({ student: studentMap.get(a.studentId), stopName: a.stopName }))
          .filter(item => item.student)
          .sort((a, b) => (stopOrder.get(a.stopName) ?? Infinity) - (stopOrder.get(b.stopName) ?? Infinity))
          .map(({ student, stopName }, index) => ({
            serialNo: index + 1,
            studentName: student!.name,
            admissionNo: student!.admissionNo,
            class: student!.class,
            section: student!.section,
            stop: stopName,
          }));
          
        return {
            reportType: 'vehicle',
            vehicleNo: selectedVehicle.number,
            routeName: assignedRoute.name,
            driver: driverMap.get(assignedRoute.driverId) || 'N/A',
            totalStudents: studentsOnVehicle.length,
            students: studentsOnVehicle,
        };

      case 'class':
        if (!selectedClassId) return null;
        const [className, sectionName] = selectedClassId.split('-');
        const studentsInClass = allStudents.filter(s => s.class === className && s.section === sectionName);
        const transportUsers = studentsInClass
            .map((student) => {
                const assignment = assignments.find(a => a.studentId === student.id);
                if (!assignment) return null;
                const route = routeMap.get(assignment.routeId);
                return {
                    student,
                    route: route?.name || 'N/A',
                    stop: assignment.stopName
                };
            })
            .filter(Boolean)
            .map((item, index) => ({
                serialNo: index + 1,
                studentName: item!.student.name,
                admissionNo: item!.student.admissionNo,
                route: item!.route,
                stop: item!.stop
            }));
            
        return {
            reportType: 'class',
            className: `${className}-${sectionName}`,
            totalStudents: transportUsers.length,
            students: transportUsers,
        };

      default:
        return null;
    }
  }, [activeTab, selectedRouteId, selectedVehicleId, selectedClassId, allRoutes, allVehicles, allDrivers, allStudents, assignments, routeMap, vehicleMap, driverMap, studentMap]);

  return (
    <>
      <div className="non-printable">
        <Card className="glassmorphic">
          <CardHeader>
            <CardTitle>Transport Reports</CardTitle>
            <CardDescription>Select a report type and filter to generate a register.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="route">Route-wise</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle-wise</TabsTrigger>
                <TabsTrigger value="class">Class-wise</TabsTrigger>
              </TabsList>
              <div className="mt-4 flex flex-col sm:flex-row gap-4 items-end">
                {activeTab === 'route' && (
                   <div className="w-full sm:w-80">
                        <label className="text-sm font-medium">Route</label>
                        <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                            <SelectTrigger><SelectValue placeholder="Select a route" /></SelectTrigger>
                            <SelectContent>
                            {allRoutes.map(route => <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                   </div>
                )}
                 {activeTab === 'vehicle' && (
                   <div className="w-full sm:w-80">
                        <label className="text-sm font-medium">Vehicle</label>
                        <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
                            <SelectTrigger><SelectValue placeholder="Select a vehicle" /></SelectTrigger>
                            <SelectContent>
                            {allVehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.number}</SelectItem>)}
                            </SelectContent>
                        </Select>
                   </div>
                )}
                 {activeTab === 'class' && (
                   <div className="w-full sm:w-80">
                        <label className="text-sm font-medium">Class</label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={`${c.name.split('-')[0].replace('Class ', '')}-${c.name.split('-')[1]}`}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                   </div>
                )}
                <Button onClick={handlePrint} disabled={!reportData}>
                    <Printer className="mr-2 h-4 w-4" /> Print Register
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {reportData && (
        <div ref={printRef} className="printable-area mt-8">
          <Card>
             {reportData.reportType === 'route' && (
                <>
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
                        <TableHeader><TableRow><TableHead>S.No.</TableHead><TableHead>Student Name</TableHead><TableHead>Adm. No.</TableHead><TableHead>Class</TableHead><TableHead>Stop</TableHead><TableHead>Pickup Time</TableHead><TableHead>Parent Contact</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {reportData.students.map(s => (
                            <TableRow key={s.serialNo}><TableCell>{s.serialNo}</TableCell><TableCell>{s.studentName}</TableCell><TableCell>{s.admissionNo}</TableCell><TableCell>{s.class}-{s.section}</TableCell><TableCell>{s.stop}</TableCell><TableCell>{s.pickupTime}</TableCell><TableCell>{s.parentPhone}</TableCell></TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                </CardContent>
                </>
             )}
             {reportData.reportType === 'vehicle' && (
                <>
                <CardHeader className="text-center border-b pb-4"><h2 className="text-2xl font-bold">Aedura Elite School</h2><h3 className="text-xl font-semibold">Transport Register - Vehicle-wise Students</h3></CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-4 gap-4 text-sm mb-4 p-2 bg-muted/50 rounded-md"><p><strong>Vehicle:</strong> {reportData.vehicleNo}</p><p><strong>Route:</strong> {reportData.routeName}</p><p><strong>Driver:</strong> {reportData.driver}</p><p><strong>Total Students:</strong> {reportData.totalStudents}</p></div>
                    <div className="border rounded-md">
                        <Table><TableHeader><TableRow><TableHead>S.No.</TableHead><TableHead>Student Name</TableHead><TableHead>Adm. No.</TableHead><TableHead>Class</TableHead><TableHead>Stop</TableHead></TableRow></TableHeader>
                        <TableBody>{reportData.students.map(s => (<TableRow key={s.serialNo}><TableCell>{s.serialNo}</TableCell><TableCell>{s.studentName}</TableCell><TableCell>{s.admissionNo}</TableCell><TableCell>{s.class}-{s.section}</TableCell><TableCell>{s.stop}</TableCell></TableRow>))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
                </>
             )}
             {reportData.reportType === 'class' && (
                <>
                <CardHeader className="text-center border-b pb-4"><h2 className="text-2xl font-bold">Aedura Elite School</h2><h3 className="text-xl font-semibold">Transport Register - Class-wise Students</h3></CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4 p-2 bg-muted/50 rounded-md"><p><strong>Class:</strong> {reportData.className}</p><p><strong>Total Students Using Transport:</strong> {reportData.totalStudents}</p></div>
                    <div className="border rounded-md">
                        <Table><TableHeader><TableRow><TableHead>S.No.</TableHead><TableHead>Student Name</TableHead><TableHead>Adm. No.</TableHead><TableHead>Route</TableHead><TableHead>Stop</TableHead></TableRow></TableHeader>
                        <TableBody>{reportData.students.map(s => (<TableRow key={s.serialNo}><TableCell>{s.serialNo}</TableCell><TableCell>{s.studentName}</TableCell><TableCell>{s.admissionNo}</TableCell><TableCell>{s.route}</TableCell><TableCell>{s.stop}</TableCell></TableRow>))}</TableBody>
                        </Table>
                    </div>
                </CardContent>
                </>
             )}
          </Card>
        </div>
      )}
    </>
  );
}
