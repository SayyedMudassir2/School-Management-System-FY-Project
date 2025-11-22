
import { PageHeader } from "../../../components/page-header";
import { MembersClient } from "./members-client";
import { studentDirectory, teacherDirectory, bookIssuances } from "@/lib/mock-data";

export default function LibraryMembersPage() {
  return (
    <>
      <PageHeader
        title="Library Members"
        description="Manage all student and teacher library accounts."
      />
      <MembersClient 
        students={studentDirectory}
        teachers={teacherDirectory}
        issuances={bookIssuances}
      />
    </>
  );
}
