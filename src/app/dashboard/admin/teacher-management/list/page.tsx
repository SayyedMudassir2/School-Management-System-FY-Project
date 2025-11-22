
import { PageHeader } from "../../../components/page-header";
import { ListClient } from "./list-client";
import { teacherDirectory } from "@/lib/mock-data";

export default function TeacherListPage() {
  return (
    <>
      <PageHeader
        title="Teacher & Staff Directory"
        description="Search, filter, and manage all faculty and staff in the school."
      />
      <ListClient teachers={teacherDirectory} />
    </>
  );
}

    