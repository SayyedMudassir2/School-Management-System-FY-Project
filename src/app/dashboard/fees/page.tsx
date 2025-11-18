
import { PageHeader } from "../components/page-header";
import { FeesClient } from "./fees-client";

export default function FeesPage() {
  return (
    <>
      <PageHeader
        title="Fees Management"
        description="You can handle fee structures, invoicing, payments, and reporting."
      />
      <FeesClient />
    </>
  );
}
