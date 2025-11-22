
import { PageHeader } from "../../../components/page-header";
import { AddTeacherForm } from "./add-teacher-form";

export default function AddTeacherPage() {
  return (
    <>
      <PageHeader
        title="Add New Teacher/Staff"
        description="Fill out the form below to onboard a new faculty or staff member."
      />
      <AddTeacherForm />
    </>
  );
}
