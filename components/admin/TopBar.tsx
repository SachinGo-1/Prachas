"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { titleForPath } from "@/components/admin/nav";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = titleForPath(pathname);
  const [unread, setUnread] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.kpis) {
          setUnread(data.kpis.unreadInquiries ?? 0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // Re-check when navigating between admin pages.
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-bg-raised/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md p-2 text-foreground lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h1>
      </div>

      <Link
        href="/admin/inquiries"
        className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={unread ? `${unread} unread inquiries` : "Notifications"}
      >
        <Bell className="h-5 w-5" />
        {unread ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </Link>
    </header>
  );
}
