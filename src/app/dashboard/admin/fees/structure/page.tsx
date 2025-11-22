
import { PageHeader } from "../../../components/page-header";
import { FeeStructureClient } from "./fee-structure-client";
import { feeStructures, classes, studentDirectory, fees } from "@/lib/mock-data";

export default function FeeStructurePage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');

  return (
    <>
      <PageHeader
        title="Fee Structure & Collection"
        description="Define fee structures and manage student payments."
      />
      <FeeStructureClient 
        initialFeeStructures={feeStructures} 
        allClasses={classes}
        allStudents={activeStudents}
        allFees={fees}
      />
    </>
  );
}
