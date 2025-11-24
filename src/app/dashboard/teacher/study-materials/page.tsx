
import { PageHeader } from "../../components/page-header";
import { MaterialsClient } from "./materials-client";
import { classes } from "@/lib/mock-data";

export default function StudyMaterialsPage() {
  return (
    <>
      <PageHeader
        title="Study Materials"
        description="Manage and distribute digital resources for your classes."
      />
      <MaterialsClient classes={classes} />
    </>
  );
}
