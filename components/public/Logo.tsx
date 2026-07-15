import { cn } from "@/lib/utils";

/**
 * Prachas Technologies logo.
 *
 * The mark is an abstract, geometric interpretation of the brand's
 * "two people meeting over a table" motif — two figures (a reaching
 * figure and a standing figure) above a connecting baseline — rendered
 * entirely as inline SVG in lime green, so no image asset is required.
 *
 *   variant="stacked"     icon above the wordmark (hero / footer)
 *   variant="horizontal"  icon left, wordmark + sub-label stacked right (navbar)
 *   variant="icon"        the mark only
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      role="img"
      aria-hidden="true"
      className={cn("text-accent", className)}
    >
      {/* Left figure — head + reaching shoulder */}
      <circle cx="20" cy="14" r="8" fill="currentColor" />
      <path
        d="M8 44 C8 30 12 23 20 23 C27 23 31 29 31 37"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right figure — head + standing shoulder */}
      <circle cx="45" cy="11" r="8" fill="currentColor" />
      <path
        d="M56 44 C56 27 52 21 45 21 C40 21 36 25 35 30"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Connecting baseline */}
      <rect x="5" y="43" width="54" height="6" rx="3" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "horizontal",
  showSubLabel = true,
}: {
  className?: string;
  variant?: "stacked" | "horizontal" | "icon";
  showSubLabel?: boolean;
}) {
  if (variant === "icon") {
    return <LogoMark className={cn("h-8 w-8", className)} />;
  }

  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex flex-col items-center gap-3", className)}>
        <LogoMark className="h-14 w-14" />
        <span className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            PRACHAS
          </span>
          {showSubLabel && (
            <span className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-wider2 text-muted-foreground">
              Technologies
            </span>
          )}
        </span>
      </span>
    );
  }

  // horizontal (navbar): icon left, wordmark + sub-label stacked right
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          PRACHAS
        </span>
        {showSubLabel && (
          <span className="mt-0.5 font-mono text-[0.55rem] uppercase tracking-wider2 text-muted-foreground">
            Technologies
          </span>
        )}
      </span>
    </span>
  );
}
