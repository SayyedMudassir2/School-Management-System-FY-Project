
import { PageHeader } from "../../components/page-header";
import { FeesClient } from "./fees-client";
import { studentDirectory, fees, mockReceipts } from "@/lib/mock-data";

export default function StudentFeesPage() {
    // In a real app, you'd fetch this based on the logged-in user
    const student = studentDirectory.find(s => s.id === 'S003');
    const studentFees = fees.filter(f => f.studentId === student?.id);
    const studentReceipts = mockReceipts.filter(r => r.student.id === student?.id);

    if (!student) {
        return <div>Student not found</div>
    }

  return (
    <>
      <PageHeader
        title="Fee Payment"
        description="View your fee history, pay outstanding dues, and download receipts."
      />
      <FeesClient 
        student={student}
        fees={studentFees}
        receipts={studentReceipts}
      />
    </>
  );
}
