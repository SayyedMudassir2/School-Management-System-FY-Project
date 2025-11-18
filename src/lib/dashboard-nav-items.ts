
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
    BookOpen
  } from "lucide-react";

export const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Admin", href: "/dashboard/admin", icon: Shield },
    { title: "Parent", href: "/dashboard/parent", icon: User },
    { title: "Student", href: "/dashboard/student", icon: UserCog },
    { title: "School Setup", href: "/dashboard/setup", icon: Building2 },
    { title: "Attendance", href: "/dashboard/attendance", icon: Presentation },
    { title: "User Management", href: "/dashboard/users", icon: Users },
    { title: "Fees Management", href: "/dashboard/fees", icon: Banknote },
    { title: "Communication", href: "/dashboard/communication", icon: MessageCircle },
    { title: "Library", href: "/dashboard/library", icon: BookOpen },
];
