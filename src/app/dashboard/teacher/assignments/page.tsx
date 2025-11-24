
import { PageHeader } from "../../components/page-header";
import { AssignmentsClient } from "./assignments-client";
import { classes, studentDirectory, teacherDirectory } from "@/lib/mock-data";

export default function AssignmentsPage() {
  // Mock data for assignments, submissions, etc. would be fetched here
  const assignments = [
    { id: 'AS01', title: 'Algebra Homework 1', class: 'Class 10-A', subject: 'Mathematics', dueDate: '2024-08-15', submissions: 18, totalStudents: 22 },
    { id: 'AS02', title: 'Photosynthesis Lab Report', class: 'Class 9-B', subject: 'Biology', dueDate: '2024-08-12', submissions: 25, totalStudents: 25 },
    { id: 'AS03', title: 'Essay on World War II', class: 'Class 10-A', subject: 'History', dueDate: '2024-08-20', submissions: 0, totalStudents: 22 },
  ];

  return (
    <>
      <PageHeader
        title="Assignments"
        description="Create, view, and grade student assignments."
      />
      <AssignmentsClient 
        initialAssignments={assignments}
        classes={classes}
        students={studentDirectory}
      />
    </>
  );
}
