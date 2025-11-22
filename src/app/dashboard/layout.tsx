
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
  Bell,
  Search,
  LifeBuoy
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";
import { getNavItemsForRole } from "@/lib/dashboard-nav-items";
import type { NavItem, UserRole } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Breadcrumb } from "./components/breadcrumb";
import { useEffect, useState, useMemo } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const getRoleFromPath = (path: string): UserRole | null => {
  const segments = path.split('/');
  if (segments.length > 2 && ['admin', 'parent', 'student', 'teacher'].includes(segments[2])) {
    return segments[2] as UserRole;
  }
  return null;
}

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
  const [role, setRole] = useState<UserRole>('admin'); // Default to admin
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    const pathRole = getRoleFromPath(pathname);
    const paramRole = searchParams.get('role') as UserRole;
    const activeRole = pathRole || paramRole || role;

    if (activeRole && ['admin', 'parent', 'student', 'teacher'].includes(activeRole)) {
        if(activeRole !== role) {
            setRole(activeRole);
        }
        const filteredItems = getNavItemsForRole(activeRole);
        setCurrentNavItems(filteredItems);
    } else {
        // Fallback for paths without a clear role
        const defaultItems = getNavItemsForRole('admin');
        setCurrentNavItems(defaultItems);
    }
    
    setLoading(false);

  }, [pathname, searchParams, role]);

  const userDetails = {
    admin: { name: 'Alex Doe', role: 'Administrator' },
    parent: { name: 'Jane Doe', role: 'Parent' },
    student: { name: 'John Doe', role: 'Student' },
    teacher: { name: 'Mr. Smith', role: 'Teacher' }
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
                  <SidebarMenuItem key={item.href}>
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
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
              <SidebarTrigger />
              <Breadcrumb />
              <div className="relative ml-auto flex-1 md:grow-0">
                <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px] text-muted-foreground"
                    >
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      Search...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search pages..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Pages">
                          {currentNavItems.map(item => (
                             <Link key={item.href} href={item.href} onClick={() => setSearchOpen(false)}>
                                <CommandItem>
                                  <item.icon className="mr-2 h-4 w-4" />
                                  <span>{item.title}</span>
                                </CommandItem>
                            </Link>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Notifications</TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full h-8 w-8"
                  >
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/1/100/100" alt={currentUser.name} data-ai-hint="person portrait" />
                        <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help"><LifeBuoy className="mr-2 h-4 w-4" />Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/login"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </header>
          <main className="flex-1 p-4 sm:p-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
