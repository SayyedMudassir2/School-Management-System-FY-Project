
import { PageHeader } from "@/app/dashboard/components/page-header";
import { SubmissionsClient } from "./submissions-client";
import { studentDirectory } from "@/lib/mock-data";

export default function AssignmentSubmissionsPage({ params }: { params: { assignmentId: string } }) {
  // Mock data fetching
  const assignment = {
    id: params.assignmentId,
    title: 'Algebra Homework 1',
    class: 'Class 10-A',
  };
  
  const students = studentDirectory.filter(s => `Class ${s.class}-${s.section}` === assignment.class);

  // Mock submission data
  const submissions = students.map(student => ({
      studentId: student.id,
      status: Math.random() > 0.5 ? 'Submitted' : 'Not Submitted',
      submittedAt: Math.random() > 0.5 ? new Date().toISOString() : null,
      grade: null,
  }));

  return (
    <>
      <PageHeader
        title={assignment.title}
        description={`Submissions for ${assignment.class}`}
      />
      <SubmissionsClient 
        students={students} 
        submissions={submissions}
      />
    </>
  );
}
