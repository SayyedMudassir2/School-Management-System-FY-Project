
import { PageHeader } from "../../components/page-header";
import { StudentDirectoryClient } from "./directory-client";
import { studentDirectory, classes } from "@/lib/mock-data";

export default function TeacherStudentDirectoryPage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');

  return (
    <>
      <PageHeader
        title="Student Directory"
        description="Search and manage students in your assigned classes."
      />
      <StudentDirectoryClient students={activeStudents} classes={classes} />
    </>
  );
}
