
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
    Settings,
    CalendarCheck
  } from "lucide-react";

export const navItems: NavItem[] = [
    { title: "Admin", href: "/dashboard/admin", icon: Shield },
    { title: "Teacher", href: "/dashboard/teacher", icon: UserCog },
    { title: "Parent", href: "/dashboard/parent", icon: User },
    { title: "Student", href: "/dashboard/student", icon: User },
    { title: "School Setup", href: "/dashboard/setup", icon: Building2 },
    { title: "Student Management", href: "/dashboard/student-management", icon: Users },
    { title: "Teacher Management", href: "/dashboard/teacher-management", icon: UserCog },
    { title: "Fees Management", href: "/dashboard/fees", icon: Banknote },
    { title: "Communication", href: "/dashboard/communication", icon: MessageCircle },
    { title: "Library", href: "/dashboard/library", icon: BookOpen },
    { title: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
];
