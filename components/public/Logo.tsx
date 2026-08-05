import { cn } from "@/lib/utils";

/**
 * Prachas logo.
 *
 * The mark is the brand's "two people meeting over a table" motif —
 * a larger foreground figure and a smaller companion drawn in outline
 * behind a table with an angled leg — rendered as inline SVG in brand
 * ink, so no image asset is required.
 *
 *   variant="stacked"     icon above the wordmark (hero / footer)
 *   variant="horizontal"  icon left, wordmark + sub-label stacked right (navbar)
 *   variant="icon"        the mark only
 *
 * Both the mark and the wordmark inherit `currentColor`, so the logo
 * renders correctly on the ink admin sidebar as well as on white — put
 * it inside a text-coloured container rather than passing a colour in.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 56"
      role="img"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* Left figure — outlined head + shoulders passing behind the table */}
      <circle cx="24" cy="11" r="6.5" stroke="currentColor" strokeWidth="5" />
      <path
        d="M13 41 C13 26 17 21.5 24 21.5 C31 21.5 35 26 35 36"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Right figure — smaller outlined head + shoulders */}
      <circle cx="45" cy="9" r="5" stroke="currentColor" strokeWidth="5" />
      <path
        d="M37 27 C37 19.5 40 17 45 17 C50 17 53 19.5 53 27"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Table top + angled leg */}
      <path
        d="M6 29.5 L58 29.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M23 32 L15 50"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
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
          <span className="font-display text-2xl font-bold tracking-[0.12em]">
            PRACHAS
          </span>
          {showSubLabel && (
            <span className="mt-1.5 text-[0.62rem] uppercase tracking-wider2 opacity-60">
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
        <span className="font-display text-lg font-bold tracking-[0.12em]">
          PRACHAS
        </span>
        {showSubLabel && (
          <span className="mt-0.5 text-[0.55rem] uppercase tracking-wider2 opacity-60">
            Technologies
          </span>
        )}
      </span>
    </span>
  );
}
