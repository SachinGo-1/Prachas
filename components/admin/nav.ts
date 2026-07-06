import {
  LayoutDashboard,
  Briefcase,
  Users,
  MessageSquare,
  UserCog,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/jobs", label: "Job Postings", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/team", label: "Team", icon: UserCog },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function titleForPath(pathname: string): string {
  // Longest matching prefix wins so /admin/jobs doesn't match /admin.
  const match = [...ADMIN_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href)
    );
  return match?.label ?? "Admin";
}
