
import { PageHeader } from "../../components/page-header";
import { ExamsClient } from "./exams-client";

export default function StudentExamsPage() {
  return (
    <>
      <PageHeader
        title="Exam Results"
        description="View your exam performance and download report cards."
      />
      <ExamsClient />
    </>
  );
}
