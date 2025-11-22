
import { PageHeader } from "../../components/page-header";
import { LibraryClient } from "./library-client";
import { books, studentDirectory, bookIssuances } from "@/lib/mock-data";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Smart Library"
        description="Manage book repositories, track circulation, and gain insights."
      />
      <LibraryClient 
        initialBooks={books}
        students={studentDirectory}
        initialIssuances={bookIssuances}
      />
    </>
  );
}
