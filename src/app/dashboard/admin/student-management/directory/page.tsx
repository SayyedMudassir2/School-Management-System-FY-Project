
import { PageHeader } from "../../../components/page-header";
import { DirectoryClient } from "./directory-client";

export default function StudentDirectoryPage() {
  return (
    <>
      <PageHeader
        title="Student Directory"
        description="Search, filter, and manage all students in the school."
      />
      <DirectoryClient />
    </>
  );
}
