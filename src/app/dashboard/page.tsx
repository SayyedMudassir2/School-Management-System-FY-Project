
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "./components/page-header";
import { User, Shield, UserCog } from "lucide-react";

const roles = [
    {
        name: "Admin",
        description: "Full access to all school management features.",
        href: "/dashboard/admin",
        icon: Shield
    },
    {
        name: "Parent",
        description: "View your child's progress, attendance, and fees.",
        href: "/dashboard/parent",
        icon: User
    },
    {
        name: "Student",
        description: "Access your courses, assignments, and grades.",
        href: "/dashboard/student",
        icon: UserCog
    }
]

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Select a Dashboard" description="Choose your role to view the corresponding dashboard." />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map(role => (
            <Link key={role.name} href={role.href}>
                <Card className="glassmorphic hover:bg-muted/40 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{role.name}</CardTitle>
                        <role.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </>
  );
}
