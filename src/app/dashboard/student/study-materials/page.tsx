
import { PageHeader } from "../../components/page-header";
import { MaterialsClient } from "./materials-client";
import { classes } from "@/lib/mock-data";

export default function StudentStudyMaterialsPage() {
  return (
    <>
      <PageHeader
        title="Study Materials"
        description="Download notes, videos, and other resources uploaded by your teachers."
      />
      <MaterialsClient classes={classes} />
    </>
  );
}
