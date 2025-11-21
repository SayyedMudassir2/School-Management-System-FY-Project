
import { PageHeader } from "../../components/page-header";
import { AcademicsClient } from "./academics-client";

export default function AcademicsPage() {
  return (
    <>
      <PageHeader
        title="Academics"
        description="Manage all academic-related activities."
      />
      <AcademicsClient />
    </>
  );
}
