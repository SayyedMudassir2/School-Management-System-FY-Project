
import { PageHeader } from "../components/page-header";
import { TeacherManagementClient } from "./teacher-management-client";

export default function TeacherManagementPage() {
  return (
    <>
      <PageHeader
        title="Teacher Management"
        description="Oversee all aspects of faculty administration."
      />
      <TeacherManagementClient />
    </>
  );
}
