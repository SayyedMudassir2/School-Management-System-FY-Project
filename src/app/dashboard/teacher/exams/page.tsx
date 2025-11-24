
import { PageHeader } from "../../components/page-header";
import { ExamsClient } from "./exams-client";

export default function ExamsPage() {
  return (
    <>
      <PageHeader
        title="Examinations"
        description="Manage exam schedules, enter marks, and generate student reports."
      />
      <ExamsClient />
    </>
  );
}
