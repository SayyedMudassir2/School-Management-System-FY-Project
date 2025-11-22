
import type { NavItem } from "@/lib/types";
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
    BookUser
  } from "lucide-react";

export const navItems: NavItem[] = [
    { title: "Admin", href: "/dashboard/admin", icon: Shield },
    { title: "Teacher", href: "/dashboard/teacher", icon: UserCog },
    { title: "Parent", href: "/dashboard/parent", icon: User },
    { title: "Student", href: "/dashboard/student", icon: User },
    { title: "Academics", href: "/dashboard/admin/academics", icon: GraduationCap },
    { title: "School Setup", href: "/dashboard/admin/setup", icon: Building2 },
    { title: "Student Management", href: "/dashboard/admin/student-management", icon: Users },
    { title: "Teacher Management", href: "/dashboard/admin/teacher-management", icon: UserCog },
    { title: "Assign Teachers", href: "/dashboard/admin/teacher-management/assign", icon: BookUser },
    { title: "Fees Management", href: "/dashboard/admin/fees", icon: Banknote },
    { title: "Communication", href: "/dashboard/admin/communication", icon: MessageCircle },
    { title: "Library", href: "/dashboard/admin/library", icon: BookOpen },
    { title: "Transport", href: "/dashboard/admin/transport", icon: Bus },
    { title: "Attendance", href: "/dashboard/teacher/attendance", icon: CalendarCheck },
];
