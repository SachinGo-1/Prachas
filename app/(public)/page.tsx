import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/public/HeroSection";
import { StatsBar } from "@/components/public/StatsBar";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import { SectionHeading } from "@/components/public/SectionHeading";
import { CTABanner } from "@/components/public/CTABanner";
import { WHY_PRACHAS, INDUSTRIES, TESTIMONIALS } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />

      {/* Services teaser */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="What We Do"
          title="Services built for US businesses"
          description="Recruiting, staffing, BPO, and consulting — delivered by dedicated teams aligned to your goals and your time zones."
        />
        <ServicesGrid limit={3} className="mt-12" />
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-label text-accent transition-colors hover:text-accent-dim"
          >
            See all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Why Prachas */}
      <section className="border-y border-border bg-bg-card">
        <div className="container grid gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-label text-accent">
              Why Prachas
            </p>
            <h2 className="mt-4 font-display text-display font-bold tracking-tight text-foreground">
              Built for the US market.{" "}
              <span className="text-accent">Grounded in India.</span>
            </h2>
          </div>

          <ul className="space-y-8">
            {WHY_PRACHAS.map((item) => (
              <li key={item.title} className="flex gap-4">
                <span
                  className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          eyebrow="Industries"
          title="Industries we serve"
          description="Deep experience across the sectors that power the US economy."
        />
        <div className="no-scrollbar mt-10 flex gap-3 overflow-x-auto">
          {INDUSTRIES.map((industry) => (
            <span
              key={industry}
              className="shrink-0 whitespace-nowrap rounded-full border border-border bg-bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-accent"
            >
              {industry}
            </span>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-bg-card">
        <div className="container py-20 sm:py-24">
          <SectionHeading
            align="center"
            eyebrow="In Their Words"
            title="Trusted by US teams"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-xl border border-border bg-bg-card p-8"
              >
                <blockquote className="text-lg italic leading-relaxed text-foreground/90">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 font-mono text-xs">
                  <span className="text-accent">{t.name}</span>
                  <span className="text-muted-foreground"> — {t.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="py-20 sm:py-24">
        <CTABanner />
      </div>
    </>
  );
}
