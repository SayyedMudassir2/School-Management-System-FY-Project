
import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="You can manage your account and application preferences."
      />
      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction.  Here you'll be able to manage your personal profile, notification preferences, and other application settings.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
