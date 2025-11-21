
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Banknote, FileText, FileWarning, BarChart2, TrendingDown } from "lucide-react";

const feeActions = [
    {
        title: "Fee Structure",
        description: "Define and manage class-wise fee structures.",
        icon: Scale,
    },
    {
        title: "Collect Fees",
        description: "Process and record incoming fee payments.",
        icon: Banknote,
    },
    {
        title: "Fee Receipts",
        description: "Generate and view payment receipts for students.",
        icon: FileText,
    },
    {
        title: "Pending/Due Fees",
        description: "Track all outstanding and overdue payments.",
        icon: FileWarning,
    },
    {
        title: "Expense Management",
        description: "Record and categorize all school expenditures.",
        icon: TrendingDown,
    },
    {
        title: "Income–Expense Report",
        description: "Generate detailed financial reports and analytics.",
        icon: BarChart2,
    }
];

export function FeesClient() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feeActions.map((action) => (
            <Card key={action.title} className="glassmorphic">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <action.icon className="h-6 w-6 text-primary" />
                        {action.title}
                    </CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline">
                        Manage <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
