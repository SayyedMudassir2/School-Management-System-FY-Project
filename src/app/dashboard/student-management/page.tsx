
import { PageHeader } from "../components/page-header";
import { StudentManagementClient } from "./student-management-client";

export default function StudentManagementPage() {
  return (
    <>
      <PageHeader
        title="Student Management"
        description="Oversee all aspects of student administration."
      />
      <StudentManagementClient />
    </>
  );
}
