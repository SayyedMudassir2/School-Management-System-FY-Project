
import { PageHeader } from "./components/page-header";
import { Sitemap } from "./components/sitemap";

// This page might not be directly visible as middleware will redirect.
// However, it can serve as a fallback or a general dashboard entry point view
// if middleware logic were to change.
export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Welcome to Aedura"
        description="Select a section to get started."
      />
      <Sitemap />
    </>
  );
}
