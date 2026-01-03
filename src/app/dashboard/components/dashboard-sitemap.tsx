
'use client';

import Link from "next/link";
import { dashboardNavItems } from "@/lib/dashboard-nav-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function DashboardSitemap() {
    const pathname = usePathname();

    // Filter out the main dashboard link
    const sitemapItems = dashboardNavItems.filter(item => item.href !== '/dashboard' && item.href !== '/dashboard/admin' && item.href !== '/dashboard/parent' && item.href !== '/dashboard/student');

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sitemapItems.map((item) => {
                 const isActive = pathname === item.href;
                return (
                    <Link key={item.title} href={item.href}>
                        <Card className={cn("glassmorphic transition-all duration-200 hover:scale-105 hover:bg-muted/30", isActive && "bg-muted/50")}>
                            <CardContent className="p-4 flex items-center gap-4">
                                <item.icon className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-semibold text-sm">{item.title}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    );
}
