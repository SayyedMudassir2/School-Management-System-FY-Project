
'use client';

import Link from "next/link";
import { usePathname, useSearchParams } from 'next/navigation';
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
import { useSidebar } from "@/components/ui/sidebar";

type Role = 'admin' | 'parent' | 'student';

const getRoleFromPath = (path: string): Role | null => {
  if (path.startsWith('/dashboard/admin')) return 'admin';
  if (path.startsWith('/dashboard/parent')) return 'parent';
  if (path.startsWith('/dashboard/student')) return 'student';
  return null;
}

const getFilteredNavItems = (role: Role | null): NavItem[] => {
  if (!role) {
    return navItems.filter(item => 
        item.href !== '/dashboard/admin' &&
        item.href !== '/dashboard/parent' &&
        item.href !== '/dashboard/student'
    );
  }
  const forbiddenLinks: { [key in Role]: string[] } = {
    admin: ["/dashboard/parent", "/dashboard/student"],
    parent: ["/dashboard/admin", "/dashboard/student"],
    student: ["/dashboard/admin", "/dashboard/parent"],
  };

  return navItems.filter(item => !forbiddenLinks[role].includes(item.href));
};

function DashboardLogo() {
    const { state } = useSidebar();
    return <Logo hideText={state === 'collapsed'} />
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentNavItems, setCurrentNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);

  useEffect(() => {
    setLoading(true);
    let activeRole = getRoleFromPath(pathname);
    
    // Fallback to search param if not in path
    if (!activeRole) {
      const roleFromParam = searchParams.get('role') as Role;
      if (roleFromParam && ['admin', 'parent', 'student'].includes(roleFromParam)) {
        activeRole = roleFromParam;
      }
    }
    
    // Persist role in state
    if (activeRole) {
      setRole(activeRole);
    }
    
    const filteredItems = getFilteredNavItems(activeRole || role);
    setCurrentNavItems(filteredItems);
    
    if (filteredItems.length > 0) {
        setLoading(false);
    }
  }, [pathname, searchParams, role]);

  const userDetails = {
    admin: { name: 'Alex Doe', role: 'Administrator' },
    parent: { name: 'Jane Doe', role: 'Parent' },
    student: { name: 'John Doe', role: 'Student' }
  };

  const currentUser = userDetails[role || 'admin'];

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarRail />
          <SidebarHeader>
             <div className="flex h-16 items-center justify-center p-2">
                <DashboardLogo />
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
                      <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                      <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                      <p className="text-xs text-sidebar-foreground/70 truncate">{currentUser.role}</p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.role}</p>
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
