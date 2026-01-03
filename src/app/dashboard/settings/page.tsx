
import { PageHeader } from "../components/page-header";
import { SettingsPageClient } from "./settings-page-client";
import { FirebaseClientProvider } from "@/firebase/client-provider";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />
      <FirebaseClientProvider>
        <SettingsPageClient />
      </FirebaseClientProvider>
    </>
  );
}
