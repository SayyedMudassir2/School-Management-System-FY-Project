
import type { NavItem } from "@/lib/types";
import {
    BookMarked,
    Building2,
    LayoutDashboard,
    MessageCircle,
    Presentation,
    Users,
    Banknote,
    User,
    UserCog,
    Shield,
    BookOpen,
    Settings,
  } from "lucide-react";

export const navItems: NavItem[] = [
    { title: "Admin", href: "/dashboard/admin", icon: Shield },
    { title: "Parent", href: "/dashboard/parent", icon: User },
    { title: "Student", href: "/dashboard/student", icon: UserCog },
    { title: "School Setup", href: "/dashboard/setup", icon: Building2 },
    { title: "Attendance", href: "/dashboard/attendance", icon: Presentation },
    { title: "Student Management", href: "/dashboard/student-management", icon: Users },
    { title: "Teacher Management", href: "/dashboard/teacher-management", icon: UserCog },
    { title: "Fees Management", href: "/dashboard/fees", icon: Banknote },
    { title: "Communication", href: "/dashboard/communication", icon: MessageCircle },
    { title: "Library", href: "/dashboard/library", icon: BookOpen },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
];
