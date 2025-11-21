
import { PageHeader } from "../../../components/page-header";
import { PromotionClient } from "./promotion-client";
import { classes, studentDirectory } from "@/lib/mock-data";

export default function PromotionPage() {
    const activeStudents = studentDirectory.filter(s => s.status === 'Active');

  return (
    <>
      <PageHeader
        title="Student Promotion"
        description="Manage student progression to the next academic year."
      />
      <PromotionClient allClasses={classes} allStudents={activeStudents} />
    </>
  );
}
