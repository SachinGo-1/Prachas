"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, ExternalLink } from "lucide-react";
import { ADMIN_NAV } from "@/components/admin/nav";
import { Logo } from "@/components/public/Logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Sidebar({
  user,
  onNavigate,
}: {
  user: { name?: string | null; email?: string | null };
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  const initials =
    (user.name || user.email || "A")
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A";

  return (
    <div className="flex h-full flex-col border-r border-border bg-[#0D0D0D] text-muted-foreground">
      <div className="flex h-20 items-center border-b border-border px-5">
        <Logo variant="horizontal" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
        {ADMIN_NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {active && (
                <span
                  className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-accent"
                  aria-hidden
                />
              )}
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View public site
        </Link>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name || "Admin"}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            aria-label="Sign out"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
