import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ServicesView } from "@/components/public/ServicesView";
import { CTABanner } from "@/components/public/CTABanner";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Recruiting, BPO, IT staffing, HR & payroll, and executive search — delivered from Hyderabad for US businesses.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b bg-brand-surface">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow="Services"
            title="Everything you need to hire and operate"
            description="Explore our five practice areas. Each is delivered by dedicated teams aligned to US business hours."
          />
        </div>
      </section>

      <section className="container pb-8">
        <ServicesView />
      </section>

      <div className="py-20 sm:py-24">
        <CTABanner
          title="Not sure which service fits?"
          subtitle="Tell us your goals and we'll recommend the right engagement model."
          buttonLabel="Get a recommendation"
        />
      </div>
    </>
  );
}
