
import { PageHeader } from "../components/page-header";
import { UsersClient } from "./users-client";

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="User Management"
        description="You can administer roles and permissions for all users."
      />
      <UsersClient />
    </>
  );
}
