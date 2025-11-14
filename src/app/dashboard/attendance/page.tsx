import { PageHeader } from "../components/page-header";
import { AttendanceClient } from "./attendance-client";
import { classes, students } from "@/lib/mock-data";

export default function AttendancePage() {
  return (
    <>
      <PageHeader
        title="Attendance Insights"
        description="Use AI to analyze attendance data, identify trends, and get actionable suggestions."
      />
      <div className="max-w-4xl mx-auto">
        <AttendanceClient classes={classes} students={students} />
      </div>
    </>
  );
}
