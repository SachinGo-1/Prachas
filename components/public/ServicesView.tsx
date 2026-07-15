import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SERVICE_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type ServiceView = {
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  industries: string[];
};

export function ServicesView({ services }: { services: ServiceView[] }) {
  return (
    <div>
      {services.map((service, i) => {
        const Icon = SERVICE_ICONS[service.slug];
        const reversed = i % 2 === 1;

        return (
          <section
            key={service.slug}
            id={service.slug}
            className={cn(
              "scroll-mt-24 py-16 sm:py-20",
              i > 0 && "border-t border-border"
            )}
          >
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Text block */}
              <div className={cn(reversed && "lg:order-2")}>
                {Icon && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="h-7 w-7" />
                  </div>
                )}
                <h2 className="mt-6 font-display text-section font-bold tracking-tight text-foreground">
                  {service.title}
                </h2>
                <div className="markdown mt-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {service.longDesc}
                  </ReactMarkdown>
                </div>
                <Link
                  href="/contact"
                  className="mt-8 inline-flex items-center gap-2 font-mono text-sm font-medium uppercase tracking-label text-accent transition-colors hover:text-accent-dim"
                >
                  Discuss this service
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Detail block */}
              <div className={cn(reversed && "lg:order-1")}>
                <div className="rounded-2xl border border-border bg-bg-card p-8">
                  <p className="font-mono text-xs font-medium uppercase tracking-label text-accent">
                    Key benefits
                  </p>
                  <ul className="mt-5 space-y-4">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-foreground/90">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-8 font-mono text-xs font-medium uppercase tracking-label text-accent">
                    Industries served
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.industries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full border border-border bg-bg-raised px-3 py-1 text-xs text-muted-foreground"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
