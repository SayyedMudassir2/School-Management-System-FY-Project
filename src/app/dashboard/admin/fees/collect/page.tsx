
import { PageHeader } from "../../../components/page-header";
import { CollectFeesClient } from "./collect-fees-client";
import { studentDirectory, classes, fees } from "@/lib/mock-data";

export default function CollectFeesPage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');
  
  return (
    <>
      <PageHeader
        title="Collect Fees"
        description="Generate invoices and track fee payments for all students."
      />
      <CollectFeesClient allStudents={activeStudents} allClasses={classes} allFees={fees} />
    </>
  );
}
