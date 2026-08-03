import {
  LayoutDashboard,
  FileText,
  Briefcase,
  ClipboardList,
  Inbox,
  Wrench,
  Users,
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
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/jobs", label: "Job Postings", icon: Briefcase },
  { href: "/admin/applications", label: "Applications", icon: ClipboardList },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/team", label: "Team Members", icon: Users },
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
