
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
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LogOut,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/lib/dashboard-nav-items";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
            {/* Page Title or Breadcrumbs could go here */}
        </header>
        <main className="flex-1 p-4 sm:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
