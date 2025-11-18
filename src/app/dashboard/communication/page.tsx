
import { PageHeader } from "../components/page-header";
import { CommunicationClient } from "./communication-client";

export default function CommunicationPage() {
  return (
    <>
      <PageHeader
        title="Communication Hub"
        description="A central place for announcements, messaging, and notifications."
      />
       <CommunicationClient />
    </>
  );
}
