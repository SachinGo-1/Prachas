import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner({
  title = "Ready to hire smarter?",
  subtitle = "Let's talk about how Prachas can support your hiring and operations goals.",
  buttonLabel = "Let's Talk",
  buttonHref = "/contact",
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-2xl border-l-4 border-accent bg-bg-card px-6 py-12 sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>
          </div>
          <Button asChild size="lg" variant="accent" className="shrink-0">
            <Link href={buttonHref}>
              {buttonLabel}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
