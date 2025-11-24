
import { PageHeader } from "@/app/dashboard/components/page-header";
import { studentDirectory } from "@/lib/mock-data";
import { ProfileClient } from "./profile-client";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";

export default function StudentProfilePage({ params }: { params: { studentId: string } }) {
  const student = studentDirectory.find(s => s.id === params.studentId);

  if (!student) {
    return (
      <>
        <PageHeader title="Student Not Found" />
        <p>The requested student could not be found.</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={student.name}
        description={`Student Profile for Admission No: ${student.admissionNo}`}
      >
        <Button asChild>
            <Link href={`mailto:${student.email}`}>
                <Mail className="mr-2 h-4 w-4" /> Contact Student
            </Link>
        </Button>
      </PageHeader>
      <ProfileClient student={student} />
    </>
  );
}
