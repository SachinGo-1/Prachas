import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ServicesGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <Link
            key={service.slug}
            href={`/services#${service.slug}`}
            className="group relative flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-saffron/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy transition-colors group-hover:bg-brand-saffron/10 group-hover:text-brand-saffron">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 flex items-start justify-between gap-2 text-lg font-semibold text-brand-ink">
              {service.title}
              <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-muted opacity-0 transition-opacity group-hover:opacity-100" />
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              {service.short}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
