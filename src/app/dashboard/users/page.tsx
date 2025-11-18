
import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <>
      <PageHeader
        title="User Management"
        description="You can administer roles and permissions for all users."
      />
       <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction.  Here you'll be able to create and manage users with roles for Teachers, Students, Parents, and Admins.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
