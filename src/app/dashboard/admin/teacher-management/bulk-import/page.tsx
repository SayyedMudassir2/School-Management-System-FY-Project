
import { PageHeader } from "../../../components/page-header";
import { BulkImportStaffClient } from "./bulk-import-staff-client";

export default function BulkImportStaffPage() {
  return (
    <>
      <PageHeader
        title="Bulk Import Staff"
        description="Import staff data from a CSV file."
      />
      <BulkImportStaffClient />
    </>
  );
}
