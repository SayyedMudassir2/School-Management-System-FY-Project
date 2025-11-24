
import { PageHeader } from "../../components/page-header";
import { MessagesClient } from "./messages-client";
import { studentDirectory, teacherDirectory, mockConversations } from "@/lib/mock-data";

export default function MessagesPage() {
    const chatUsers = [
        ...studentDirectory.map(s => ({ id: s.id, name: s.name, avatar: s.avatar, role: 'Student' })),
        ...teacherDirectory.map(t => ({ id: t.id, name: t.name, avatar: t.avatar, role: t.designation }))
    ];

  return (
    <>
      <PageHeader
        title="Messages"
        description="Communicate directly with students, parents, and other staff members."
      />
      <MessagesClient users={chatUsers} initialConversations={mockConversations} />
    </>
  );
}
