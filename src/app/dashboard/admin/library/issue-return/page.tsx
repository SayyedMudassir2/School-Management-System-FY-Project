
import { PageHeader } from "../../../components/page-header";
import { IssueReturnClient } from "./issue-return-client";
import { studentDirectory, books, bookIssuances } from "@/lib/mock-data";

export default function IssueReturnPage() {
  const activeStudents = studentDirectory.filter(s => s.status === 'Active');
  
  return (
    <>
      <PageHeader
        title="Issue & Return Books"
        description="Manage the circulation of library books."
      />
      <IssueReturnClient 
        students={activeStudents}
        allBooks={books}
        initialIssuances={bookIssuances}
      />
    </>
  );
}
