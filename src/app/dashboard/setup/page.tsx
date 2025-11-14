import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SetupPage() {
  return (
    <>
      <PageHeader
        title="School Setup"
        description="Manage academic years, classes, subjects, and timetables."
      />
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Here you will be able to configure all
            the foundational details of your school.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
