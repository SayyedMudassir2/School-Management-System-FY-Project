
import { PageHeader } from "../../components/page-header";
import { AttendanceClient } from "./attendance-client";
import { classes, studentDirectory } from "@/lib/mock-data";

export default function AttendancePage() {
  const studentsWithDetails = studentDirectory.map(s => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar,
    admissionNo: s.admissionNo,
    classId: classes.find(c => c.name === `Class ${s.class}-${s.section}`)?.id
  }));


  return (
    <>
      <PageHeader
        title="Attendance Management"
        description="Mark daily attendance, view history, and generate reports & insights."
      />
      <div className="mx-auto">
        <AttendanceClient classes={classes} students={studentsWithDetails} />
      </div>
    </>
  );
}
