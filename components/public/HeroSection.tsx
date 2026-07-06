import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-navy text-white">
      {/* Animated grid-pulse background */}
      <div className="absolute inset-0 grid-pulse-bg" aria-hidden />
      {/* Diagonal accent wash */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-dark"
        aria-hidden
      />

      <div className="container relative py-24 sm:py-32">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-brand-saffron">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
            Hyderabad · Serving the US since {SITE.foundedYear}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Bridging US Growth with{" "}
            <span className="text-brand-saffron">India&apos;s Talent</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            11 years of staffing, recruiting, and BPO excellence from Hyderabad
            — built for American businesses.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" variant="accent">
              <Link href="/services">
                Explore Services
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
