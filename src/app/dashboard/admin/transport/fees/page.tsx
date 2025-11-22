
import { PageHeader } from "../../../components/page-header";
import { TransportFeesClient } from "./transport-fees-client";
import { transportRoutes, studentDirectory } from "@/lib/mock-data";

export default function TransportFeesPage() {
  const studentsWithTransport = studentDirectory.filter(s =>
    ['S001', 'S002', 'S004'].includes(s.id)
  );

  return (
    <>
      <PageHeader
        title="Transport Fees Management"
        description="Define fee structures, track due payments, and manage transport finances."
      />
      <TransportFeesClient 
        allRoutes={transportRoutes}
        allStudents={studentsWithTransport}
      />
    </>
  );
}
