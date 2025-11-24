
import { PageHeader } from "../../../components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExamsPage() {
  return (
    <>
      <PageHeader
        title="Examinations"
        description="This section is primarily managed from the Teacher Dashboard. Admins can view schedules and final reports here."
      />
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Admin Examination Overview</CardTitle>
          <CardDescription>
            This area is under development. Soon, you'll be able to view consolidated exam reports and schedules.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Check back for updates!</p>
        </CardContent>
      </Card>
    </>
  );
}
