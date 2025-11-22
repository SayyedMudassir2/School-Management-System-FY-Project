import type { LucideIcon } from "lucide-react";

export type UserRole = "admin" | "student" | "parent" | "teacher";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  roles: UserRole[];
};

export type NavItemGroup = {
  title: string;
  items: NavItem[];
};
