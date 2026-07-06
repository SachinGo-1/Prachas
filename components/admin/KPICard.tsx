import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KPICard({
  label,
  value,
  icon: Icon,
  hint,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-muted">{label}</p>
          <p className="mt-2 font-mono text-3xl font-bold text-brand-ink">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-brand-muted">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-lg",
            accent
              ? "bg-brand-saffron/10 text-brand-saffron"
              : "bg-brand-navy/5 text-brand-navy"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
