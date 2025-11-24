
import { PageHeader } from "../../components/page-header";
import { AnnouncementsClient } from "./announcements-client";
import { classes, mockAnnouncements } from "@/lib/mock-data";

export default function TeacherAnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Announcements"
        description="Create and view announcements for your classes."
      />
      <AnnouncementsClient classes={classes} initialAnnouncements={mockAnnouncements} />
    </>
  );
}
