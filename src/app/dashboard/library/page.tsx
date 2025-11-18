
import { PageHeader } from "../components/page-header";
import { LibraryClient } from "./library-client";
import { books, students, bookIssuances } from "@/lib/mock-data";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Smart Library"
        description="You can manage book repositories, track issues, and gain insights on borrowing."
      />
      <LibraryClient 
        initialBooks={books}
        students={students}
        initialIssuances={bookIssuances}
      />
    </>
  );
}
