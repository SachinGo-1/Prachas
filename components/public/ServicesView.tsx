"use client";

import * as React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { SERVICES } from "@/lib/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ServicesView() {
  const [active, setActive] = React.useState(SERVICES[0].slug);

  // Sync the active tab with the URL hash (e.g. /services#bpo).
  React.useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && SERVICES.some((s) => s.slug === hash)) {
        setActive(hash);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const onValueChange = (value: string) => {
    setActive(value);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${value}`);
    }
  };

  return (
    <Tabs value={active} onValueChange={onValueChange} className="mt-12">
      <div className="overflow-x-auto pb-2">
        <TabsList className="flex w-max flex-nowrap gap-1">
          {SERVICES.map((service) => (
            <TabsTrigger key={service.slug} value={service.slug}>
              {service.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {SERVICES.map((service) => {
        const Icon = service.icon;
        return (
          <TabsContent
            key={service.slug}
            value={service.slug}
            id={service.slug}
            className="scroll-mt-24"
          >
            <div className="grid gap-10 rounded-2xl border bg-card p-6 sm:p-10 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-navy">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-ink">
                    {service.title}
                  </h2>
                </div>
                <p className="mt-6 leading-relaxed text-brand-muted">
                  {service.description}
                </p>

                <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-brand-navy">
                  Key benefits
                </h3>
                <ul className="mt-4 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-saffron/15 text-brand-saffron">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm text-brand-ink">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:border-l lg:pl-10">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">
                  Industries served
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {service.industries.map((industry) => (
                    <Badge key={industry} variant="secondary">
                      {industry}
                    </Badge>
                  ))}
                </div>

                <div className="mt-8 rounded-xl bg-brand-surface p-5">
                  <p className="text-sm text-brand-muted">
                    Interested in {service.title.toLowerCase()}?
                  </p>
                  <Button asChild variant="accent" className="mt-3 w-full">
                    <Link href="/contact">
                      Talk to us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
