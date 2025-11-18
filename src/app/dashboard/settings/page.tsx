
import { PageHeader } from "../components/page-header";
import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="You can manage your account and application preferences."
      />
      <SettingsClient />
    </>
  );
}
