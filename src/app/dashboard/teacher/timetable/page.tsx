
import { PageHeader } from "../../components/page-header";
import { TimetableClient } from "./timetable-client";

export default function TimetablePage() {
  return (
    <>
      <PageHeader
        title="My Timetable"
        description="A comprehensive view of your weekly schedule and classes."
      />
      <TimetableClient />
    </>
  );
}
