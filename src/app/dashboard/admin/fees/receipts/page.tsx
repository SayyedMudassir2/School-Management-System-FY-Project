
import { PageHeader } from "../../../components/page-header";
import { ReceiptsClient } from "./receipts-client";
import { studentDirectory, fees, mockReceipts, classes } from "@/lib/mock-data";

export default function FeeReceiptsPage() {
  return (
    <>
      <PageHeader
        title="Fee Receipts"
        description="View, search, and manage all payment receipts."
      />
      <ReceiptsClient 
        initialReceipts={mockReceipts}
        students={studentDirectory}
        classes={classes}
      />
    </>
  );
}
