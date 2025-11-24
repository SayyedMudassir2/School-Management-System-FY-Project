
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
    CalendarClock,
    Megaphone,
    MessageSquare
  } from "lucide-react";

export const dashboardNavItems: NavItem[] = [
    // Admin
    { title: "Dashboard", href: "/dashboard/admin", icon: Shield, roles: ["admin"] },
    { title: "Academics", href: "/dashboard/admin/academics", icon: GraduationCap, roles: ["admin"] },
    { title: "School Setup", href: "/dashboard/admin/setup", icon: Building2, roles: ["admin"] },
    { title: "Student Management", href: "/dashboard/admin/student-management", icon: Users, roles: ["admin"] },
    { title: "Teacher Management", href: "/dashboard/admin/teacher-management", icon: UserCog, roles: ["admin"] },
    { title: "Fees Management", href: "/dashboard/admin/fees", icon: Banknote, roles: ["admin"] },
    { title: "Communication", href: "/dashboard/admin/communication", icon: MessageCircle, roles: ["admin"] },
    { title: "Library", href: "/dashboard/admin/library", icon: BookOpen, roles: ["admin"] },
    { title: "Transport", href: "/dashboard/admin/transport", icon: Bus, roles: ["admin"] },
    
    // Teacher
    { title: "Dashboard", href: "/dashboard/teacher", icon: UserCog, roles: ["teacher"] },
    { title: "My Timetable", href: "/dashboard/teacher/timetable", icon: CalendarClock, roles: ["teacher"] },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: CalendarCheck, roles: ["teacher"] },
    { title: "Students", href: "/dashboard/teacher/students", icon: Users, roles: ["teacher"] },
    { title: "Assignments", href: "/dashboard/teacher/assignments", icon: ClipboardCheck, roles: ["teacher"] },
    { title: "Exams", href: "/dashboard/teacher/exams", icon: NotebookText, roles: ["teacher"] },
    { title: "Study Materials", href: "/dashboard/teacher/study-materials", icon: BookUp, roles: ["teacher"] },
    { title: "Announcements", href: "/dashboard/teacher/announcements", icon: Megaphone, roles: ["teacher"] },
    { title: "Messages / Chat", href: "/dashboard/teacher/messages", icon: MessageSquare, roles: ["teacher"] },

    // Parent
    { title: "Dashboard", href: "/dashboard/parent", icon: User, roles: ["parent"] },

    // Student
    { title: "Dashboard", href: "/dashboard/student", icon: User, roles: ["student"] },
    { title: "My Timetable", href: "/dashboard/student/timetable", icon: CalendarClock, roles: ["student"] },
    { title: "Attendance", href: "/dashboard/student/attendance", icon: CalendarCheck, roles: ["student"] },
    { title: "Assignments", href: "/dashboard/student/assignments", icon: ClipboardCheck, roles: ["student"] },
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
