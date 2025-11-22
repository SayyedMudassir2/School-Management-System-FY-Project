
import { PageHeader } from "../../../components/page-header";
import { ExpensesClient } from "./expenses-client";
import { expenses } from "@/lib/mock-data";

export default function ExpensesPage() {
  return (
    <>
      <PageHeader
        title="Expense Management"
        description="Record and track all school expenditures."
      />
      <ExpensesClient initialExpenses={expenses} />
    </>
  );
}
