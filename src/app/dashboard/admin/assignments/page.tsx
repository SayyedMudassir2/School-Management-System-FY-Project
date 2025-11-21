
import { PageHeader } from "../../components/page-header";
import { AssignmentsClient } from "./assignments-client";

export default function AssignmentsPage() {
  return (
    <>
      <PageHeader
        title="Assignments & Homework"
        description="Create, distribute, and track student assignments and homework."
      />
      <AssignmentsClient />
    </>
  );
}
