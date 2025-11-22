
import { PageHeader } from "../../../components/page-header";
import { StudentAssignmentClient } from "./student-assignment-client";
import { studentDirectory, transportRoutes } from "@/lib/mock-data";

export default function StudentTransportAssignmentPage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');

  return (
    <>
      <PageHeader
        title="Student Transport Assignment"
        description="Assign students to transport routes and manage their stops."
      />
      <StudentAssignmentClient 
        allStudents={activeStudents}
        allRoutes={transportRoutes}
      />
    </>
  );
}
