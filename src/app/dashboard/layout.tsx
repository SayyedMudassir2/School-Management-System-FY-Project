import Link from "next/link";
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
} from "@/components/ui/sidebar";
import {
  BookMarked,
  Building2,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Presentation,
  Settings,
  Users,
  Banknote,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { Separator } from "@/components/ui/separator";
import type { NavItem } from "@/lib/types";

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "School Setup", href: "/dashboard/setup", icon: Building2 },
  { title: "Attendance", href: "/dashboard/attendance", icon: Presentation },
  { title: "User Management", href: "/dashboard/users", icon: Users },
  { title: "Fees Management", href: "/dashboard/fees", icon: Banknote },
  { title: "Communication", href: "/dashboard/communication", icon: MessageCircle },
  { title: "Library", href: "/dashboard/library", icon: BookMarked },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="size-7 text-sidebar-primary" />
            <span className="text-lg font-semibold text-sidebar-primary">
              Aedura
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2 bg-sidebar-border" />
          <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/dashboard/settings">
                  <SidebarMenuButton tooltip="Settings">
                    <Settings/>
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
             <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton tooltip="Logout">
                    <LogOut/>
                    <span>Logout</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
          </SidebarMenu>
           <Separator className="my-2 bg-sidebar-border" />
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
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6">
            <SidebarTrigger className="md:hidden" />
            {/* Page Title or Breadcrumbs could go here */}
        </header>
        <main className="flex-1 p-4 sm:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
