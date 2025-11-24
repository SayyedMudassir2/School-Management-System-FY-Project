
import { PageHeader } from "../../components/page-header";
import { SettingsPageClient } from "./settings-page-client";
import { FirebaseProvider } from "@/firebase";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="You can manage your account and application preferences."
      />
      <FirebaseProvider>
        <SettingsPageClient />
      </FirebaseProvider>
    </>
  );
}
