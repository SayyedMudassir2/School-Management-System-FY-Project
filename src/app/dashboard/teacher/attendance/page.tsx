
import { PageHeader } from "../../components/page-header";
import { AttendanceClient } from "./attendance-client";
import { classes, studentDirectory } from "@/lib/mock-data";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Mark daily attendance, view history, and generate AI-powered insights."
      />
      <div className="mx-auto">
        <AttendanceClient classes={classes} students={studentDirectory} />
      </div>
    </>
  );
}
