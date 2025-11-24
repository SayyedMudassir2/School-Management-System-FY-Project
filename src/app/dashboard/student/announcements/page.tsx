
import { PageHeader } from "../../components/page-header";
import { AnnouncementsClient } from "./announcements-client";
import { mockStudentAnnouncements } from "@/lib/mock-data";

export default function StudentAnnouncementsPage() {
  return (
    <>
      <PageHeader
        title="Notices & Announcements"
        description="Stay updated with the latest news from the school and your classes."
      />
      <AnnouncementsClient initialAnnouncements={mockStudentAnnouncements} />
    </>
  );
}
