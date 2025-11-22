
import { PageHeader } from "../../../components/page-header";
import { FeeStructureClient } from "./fee-structure-client";
import { feeStructures } from "@/lib/mock-data";

export default function FeeStructurePage() {
  return (
    <>
      <PageHeader
        title="Fee Structure"
        description="Define fee structures and manage student payments."
      />
      <FeeStructureClient 
        initialFeeStructures={feeStructures} 
      />
    </>
  );
}
