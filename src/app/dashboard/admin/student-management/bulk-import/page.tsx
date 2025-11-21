
import { PageHeader } from "../../../components/page-header";
import { BulkImportClient } from "./bulk-import-client";

export default function BulkImportPage() {
  return (
    <>
      <PageHeader
        title="Bulk Import Students"
        description="Import student data from a CSV file."
      />
      <BulkImportClient />
    </>
  );
}
