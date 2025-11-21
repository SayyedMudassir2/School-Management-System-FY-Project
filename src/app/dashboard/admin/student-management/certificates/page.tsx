
import { PageHeader } from "../../../components/page-header";
import { CertificatesClient } from "./certificates-client";
import { studentDirectory } from "@/lib/mock-data";

export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        title="ID Cards & Certificates"
        description="Generate and print official student documents."
      />
      <CertificatesClient students={studentDirectory} />
    </>
  );
}
