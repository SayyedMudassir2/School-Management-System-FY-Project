
import type { NavItem, UserRole } from "@/lib/types";
import {
    Building2,
    MessageCircle,
    Users,
    Banknote,
    User,
    UserCog,
    Shield,
    BookOpen,
    CalendarCheck,
    GraduationCap,
    Bus,
    Settings,
    NotebookText,
    ClipboardCheck,
    TrendingDown,
    BarChart2,
    BookUp,
    Map,
    MapPin,
    Wallet,
    FileBarChart,
  } from "lucide-react";

export const dashboardNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/admin", icon: Shield, roles: ["admin"] },
    { title: "Dashboard", href: "/dashboard/teacher", icon: UserCog, roles: ["teacher"] },
    { title: "Dashboard", href: "/dashboard/parent", icon: User, roles: ["parent"] },
    { title: "Dashboard", href: "/dashboard/student", icon: User, roles: ["student"] },
    { title: "Academics", href: "/dashboard/admin/academics", icon: GraduationCap, roles: ["admin"] },
    { title: "School Setup", href: "/dashboard/admin/setup", icon: Building2, roles: ["admin"] },
    { title: "Student Management", href: "/dashboard/admin/student-management", icon: Users, roles: ["admin"] },
    { title: "Teacher Management", href: "/dashboard/admin/teacher-management", icon: UserCog, roles: ["admin"] },
    { title: "Fees Management", href: "/dashboard/admin/fees", icon: Banknote, roles: ["admin"] },
    { title: "Communication", href: "/dashboard/admin/communication", icon: MessageCircle, roles: ["admin"] },
    { title: "Library", href: "/dashboard/admin/library", icon: BookOpen, roles: ["admin", "teacher", "student"] },
    { title: "Transport", href: "/dashboard/admin/transport", icon: Bus, roles: ["admin"] },
    { title: "Routes & Stops", href: "/dashboard/admin/transport/routes", icon: Map, roles: ["admin"] },
    { title: "Vehicle Management", href: "/dashboard/admin/transport/vehicles", icon: Bus, roles: ["admin"] },
    { title: "Student Assignment", href: "/dashboard/admin/transport/student-assignment", icon: UserCog, roles: ["admin"] },
    { title: "Live Tracking", href: "/dashboard/admin/transport/live-tracking", icon: MapPin, roles: ["admin", "parent"] },
    { title: "Transport Fees", href: "/dashboard/admin/transport/fees", icon: Wallet, roles: ["admin"] },
    { title: "Reports", href: "/dashboard/admin/transport/reports", icon: FileBarChart, roles: ["admin"] },
    { title: "Attendance Insights", href: "/dashboard/teacher/attendance", icon: CalendarCheck, roles: ["teacher"] },
];

export const getNavItemsForRole = (role: UserRole): NavItem[] => {
  const baseDashboardPath = `/dashboard/${role}`;
  
  // Filter items based on role
  const roleItems = dashboardNavItems.filter(item => item.roles.includes(role));
  
  // Find the primary dashboard item for the role
  const dashboardItem = roleItems.find(item => item.href === baseDashboardPath);

  // Filter out other roles' main dashboard links
  const filteredItems = roleItems.filter(item => {
    return !item.href.match(/^\/dashboard\/(admin|teacher|parent|student)$/) || item.href === baseDashboardPath;
  });
  
  // Ensure the primary dashboard item is always first, if it exists
  if (dashboardItem) {
    return [
      dashboardItem,
      ...filteredItems.filter(item => item.href !== baseDashboardPath)
    ];
  }
  
  return filteredItems;
};
