
import { PageHeader } from "../../../components/page-header";
import { DuesClient } from "./dues-client";
import { fees, studentDirectory, classes } from "@/lib/mock-data";

export default function DuesPage() {
    const studentsWithFees = studentDirectory.map(student => {
        const feeInfo = fees.find(f => f.studentId === student.id && (f.status === 'Unpaid' || f.status === 'Overdue'));
        return {
            ...student,
            feeDetails: feeInfo
        }
    }).filter(s => s.feeDetails);

  return (
    <>
      <PageHeader
        title="Pending & Due Fees"
        description="Track who hasn’t paid what and when."
      />
      <DuesClient 
        studentsWithDues={studentsWithFees}
        allClasses={classes}
      />
    </>
  );
}
