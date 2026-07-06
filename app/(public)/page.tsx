import { HeroSection } from "@/components/public/HeroSection";
import { StatsBar } from "@/components/public/StatsBar";
import { ServicesGrid } from "@/components/public/ServicesGrid";
import { SectionHeading } from "@/components/public/SectionHeading";
import { CTABanner } from "@/components/public/CTABanner";
import { WHY_PRACHAS } from "@/lib/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />

      {/* Services overview */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="What we do"
          title="Services built for US businesses"
          description="Five practice areas that let you hire faster, operate leaner, and scale with confidence."
        />
        <ServicesGrid className="mt-12" />
      </section>

      {/* Why Prachas */}
      <section className="bg-card border-y">
        <div className="container py-20 sm:py-24">
          <SectionHeading
            eyebrow="Why Prachas"
            title="An offshore partner that feels in-house"
            description="We're built around the way American businesses actually work."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {WHY_PRACHAS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-saffron/10 text-brand-saffron">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-brand-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-20 sm:py-24">
        <CTABanner />
      </div>
    </>
  );
}
