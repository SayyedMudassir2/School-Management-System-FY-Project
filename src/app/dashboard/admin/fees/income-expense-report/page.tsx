
import { PageHeader } from "../../../components/page-header";
import { IncomeExpenseClient } from "./income-expense-client";
import { mockIncome, mockExpenseSummary } from "@/lib/mock-data";

export default function IncomeExpenseReportPage() {
  return (
    <>
      <PageHeader
        title="Financial Dashboard"
        description="An overview of your school's income and expenses."
      />
      <IncomeExpenseClient
        incomeData={mockIncome}
        expenseData={mockExpenseSummary}
      />
    </>
  );
}
