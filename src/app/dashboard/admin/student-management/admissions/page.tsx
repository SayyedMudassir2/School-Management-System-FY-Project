
import { PageHeader } from "../../../components/page-header";
import { AdmissionsClient } from "./admissions-client";

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        description="Manage new student registrations and enrollment workflows."
      />
      <AdmissionsClient />
    </>
  );
}
