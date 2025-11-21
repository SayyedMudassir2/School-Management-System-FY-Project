
import { PageHeader } from "../../components/page-header";
import { TransportClient } from "./transport-client";

export default function TransportPage() {
  return (
    <>
      <PageHeader
        title="Transport Management"
        description="Oversee all transportation activities and vehicle logistics."
      />
      <TransportClient />
    </>
  );
}
