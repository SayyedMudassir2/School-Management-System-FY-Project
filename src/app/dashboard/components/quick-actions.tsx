
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Download, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  { title: "Add New Student", icon: Plus, color: "bg-blue-500", href: "/dashboard/users" },
  { title: "Generate Report", icon: Download, color: "bg-green-500", href: "#" },
  { title: "View Analytics", icon: Eye, color: "bg-purple-500", href: "#" },
  { title: "Manage Fees", icon: DollarSign, color: "bg-orange-500", href: "/dashboard/fees" },
];

export function QuickActions() {
  return (
    <Card className="glassmorphic">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="flex flex-col items-center justify-center h-28 bg-secondary/50 hover:bg-secondary/80 transition-all duration-200"
              asChild
            >
              <a href={action.href}>
                <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-sm font-medium text-center">{action.title}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
