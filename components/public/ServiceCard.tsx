import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ServiceCard({
  title,
  short,
  href,
  icon: Icon,
  className,
}: {
  title: string;
  short: string;
  href: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border border-t-2 border-t-accent bg-bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent/50 hover:border-t-accent hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="mt-5 flex items-start justify-between gap-2 font-display text-lg font-semibold text-foreground">
        {title}
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {short}
      </p>
    </Link>
  );
}
