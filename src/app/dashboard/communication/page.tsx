import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CommunicationPage() {
  return (
    <>
      <PageHeader
        title="Communication Hub"
        description="A central place for announcements, messaging, and notifications."
      />
       <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Here you will be able to send and receive communications with various user groups.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
