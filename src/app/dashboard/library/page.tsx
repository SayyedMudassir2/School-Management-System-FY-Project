import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        title="Smart Library"
        description="Manage book repositories, track issues, and gain insights on borrowing."
      />
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction.  Here you will find tools to automate and manage your school's library.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
