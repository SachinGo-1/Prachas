import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner({
  title = "Ready to scale your team?",
  subtitle = "Let's talk about how Prachas can support your hiring and operations goals.",
  buttonLabel = "Contact Us",
  buttonHref = "/contact",
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-2xl bg-brand-navy px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="absolute inset-0 grid-pulse-bg opacity-60" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-slate-200">{subtitle}</p>
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
