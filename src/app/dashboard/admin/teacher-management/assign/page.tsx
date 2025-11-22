
import { PageHeader } from "../../../components/page-header";
import { AssignClient } from "./assign-client";

export default function AssignTeacherPage() {
  return (
    <>
      <PageHeader
        title="Assign Teachers"
        description="Allocate class teachers and subject teachers."
      />
      <AssignClient />
    </>
  );
}
