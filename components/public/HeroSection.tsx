import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-5rem)] items-center overflow-hidden bg-bg">
      {/* Static dot grid */}
      <div className="absolute inset-0 dot-grid opacity-70" aria-hidden />
      {/* Ambient lime glow, top-right */}
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />
      {/* Signature scanning line — sweeps to 60% of the hero on load */}
      <div className="scanline animate-scanline" aria-hidden />
      {/* Fade to page bg at the bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
        aria-hidden
      />

      <div className="container relative py-24">
        <div className="max-w-4xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-xs uppercase tracking-label text-accent">
            [ Hyderabad &rarr; United States ]
          </span>

          <h1 className="mt-8 font-display text-hero font-extrabold tracking-tight text-foreground">
            Where Indian Talent Meets{" "}
            <span className="text-accent">American Ambition</span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            11 years of recruiting, staffing, BPO, and consulting excellence —
            built for US businesses, delivered from Hyderabad.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/services">
                Explore Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="accentOutline">
              <Link href="/jobs">View Open Roles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
