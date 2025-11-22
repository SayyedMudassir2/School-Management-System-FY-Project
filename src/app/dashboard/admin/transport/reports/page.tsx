
import { PageHeader } from "../../../components/page-header";
import { ReportsClient } from "./reports-client";
import { transportRoutes, vehicles, teacherDirectory, studentDirectory } from "@/lib/mock-data";

export default function TransportReportsPage() {
  // Dummy assignment of students to routes and stops for demonstration
  const studentAssignments = [
    { studentId: 'S001', routeId: 'R01', stopName: 'Medanta Hospital' },
    { studentId: 'S002', routeId: 'R01', stopName: 'Rajiv Chowk' },
    { studentId: 'S004', routeId: 'R02', stopName: 'Huda City Centre' },
    { studentId: 'S005', routeId: 'R02', stopName: 'South City-1 Gate' },
  ];

  return (
    <>
      <PageHeader
        title="Transport Reports & Registers"
        description="Generate and view detailed transport-related reports."
      />
      <ReportsClient
        allRoutes={transportRoutes}
        allVehicles={vehicles}
        allDrivers={teacherDirectory}
        allStudents={studentDirectory}
        assignments={studentAssignments}
      />
    </>
  );
}
