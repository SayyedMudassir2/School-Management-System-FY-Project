
import { PageHeader } from "../../components/page-header";
import { AttendanceClient } from "./attendance-client";

export default function StudentAttendancePage() {
  return (
    <>
      <PageHeader
        title="My Attendance"
        description="A detailed overview of your attendance record."
      />
      <AttendanceClient />
    </>
  );
}
