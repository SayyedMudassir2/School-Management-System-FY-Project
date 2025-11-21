
import { PageHeader } from "../../../components/page-header";
import { AddStudentForm } from "./add-student-form";

export default function AddStudentPage() {
  return (
    <>
      <PageHeader
        title="Add New Student"
        description="Fill out the form below to enroll a new student."
      />
      <AddStudentForm />
    </>
  );
}
