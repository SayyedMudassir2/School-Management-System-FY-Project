import { PageHeader } from "../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeesPage() {
  return (
    <>
      <PageHeader
        title="Fees Management"
        description="Handle fee structures, invoicing, payments, and reporting."
      />
       <Card className="glassmorphic">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This section is under construction. Here you will find a comprehensive system for all fee-related processes.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
