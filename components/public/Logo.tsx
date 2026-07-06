import { cn } from "@/lib/utils";

/**
 * Prachas wordmark + glyph. The glyph is a small "grid-pulse" motif —
 * a 2×2 dot cluster echoing the global-talent-network theme.
 */
export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "light";
}) {
  const isLight = variant === "light";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-md",
          isLight ? "bg-white/10" : "bg-brand-navy"
        )}
      >
        <span className="grid grid-cols-2 gap-[3px]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
        </span>
      </span>
      <span
        className={cn(
          "text-lg font-extrabold tracking-tight",
          isLight ? "text-white" : "text-brand-navy"
        )}
      >
        Prachas
        <span className="text-brand-saffron">.</span>
      </span>
    </span>
  );
}
