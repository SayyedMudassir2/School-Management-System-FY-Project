
import { PageHeader } from "../../../components/page-header";
import { studentDirectory, fees } from "@/lib/mock-data";
import { CollectFeesClient } from "./collect-fees-client";

export default function CollectFeesPage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');

  return (
    <>
      <PageHeader
        title="Collect Fees"
        description="Search for a student to record a new fee payment."
      />
      <CollectFeesClient
        students={activeStudents}
        initialFees={fees}
      />
    </>
  );
}
