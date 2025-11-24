
import { PageHeader } from "../../components/page-header";
import { AssignmentsClient } from "./assignments-client";
import { mockStudentAssignments } from "@/lib/mock-data";

export default function StudentAssignmentsPage() {
  return (
    <>
      <PageHeader
        title="My Assignments"
        description="View and manage your homework, submissions, and grades."
      />
      <AssignmentsClient initialAssignments={mockStudentAssignments} />
    </>
  );
}
