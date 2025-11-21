
import { PageHeader } from "../../components/page-header";
import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="System Settings"
        description="Manage critical system configurations and integrations."
      />
      <SettingsClient />
    </>
  );
}
