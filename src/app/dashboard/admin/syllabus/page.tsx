
import { PageHeader } from "../../components/page-header";
import { SyllabusClient } from "./syllabus-client";

export default function SyllabusPage() {
  return (
    <>
      <PageHeader
        title="Syllabus & Lesson Plan"
        description="Track syllabus progress and manage curriculum details for each class."
      />
      <SyllabusClient />
    </>
  );
}
