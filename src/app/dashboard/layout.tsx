
'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/lib/dashboard-nav-items";
import type { NavItem } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumb } from "./components/breadcrumb";
import { useEffect, useState } from "react";

const getRoleFromPath = (path: string): 'admin' | 'parent' | 'student' | null => {
  if (path.startsWith('/dashboard/admin')) return 'admin';
  if (path.startsWith('/dashboard/parent')) return 'parent';
  if (path.startsWith('/dashboard/student')) return 'student';
  return null;
}

const getFilteredNavItems = (role: 'admin' | 'parent' | 'student' | null): NavItem[] => {
  if (!role) {
    // Return an empty array or a default set if no role is identified yet
    // This can happen on initial load before redirection.
    return [];
  }
  const forbiddenLinks: { [key: string]: string[] } = {
    admin: ["/dashboard/parent", "/dashboard/student"],
    parent: ["/dashboard/admin", "/dashboard/student"],
    student: ["/dashboard/admin", "/dashboard/parent"],
  };

  return navItems.filter(item => !forbiddenLinks[role].includes(item.href));
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const role = getRoleFromPath(pathname);
    const filteredItems = getFilteredNavItems(role);
    setCurrentNavItems(filteredItems);
    // Only stop loading if we have items or it's a base dashboard path that will redirect
    if (filteredItems.length > 0 || pathname === '/dashboard') {
        setLoading(false);
    }
  }, [pathname]);

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarRail />
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {loading ? (
                <>
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                  <SidebarMenuSkeleton showIcon />
                </>
              ) : (
                currentNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Link href={item.href}>
                      <SidebarMenuButton tooltip={item.title} isActive={pathname.startsWith(item.href)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Separator className="my-2 bg-sidebar-border" />
            <SidebarMenu>
               <SidebarMenuItem>
                  <Link href="/dashboard/settings">
                    <SidebarMenuButton tooltip="Settings" isActive={pathname === '/dashboard/settings'}>
                      <Settings/>
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
               <SidebarMenuItem>
                  <Link href="/login">
                    <SidebarMenuButton tooltip="Logout">
                      <LogOut/>
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
            </SidebarMenu>
             <Separator className="my-2 bg-sidebar-border" />
             <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 p-2">
                  <Avatar>
                      <AvatarImage src="https://picsum.photos/seed/1/100/100" alt="Admin" data-ai-hint="person portrait"/>
                      <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate">Alex Doe</p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">Administrator</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p className="font-semibold">Alex Doe</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </TooltipContent>
             </Tooltip>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
              <SidebarTrigger />
              <Breadcrumb />
          </header>
          <main className="flex-1 p-4 sm:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
