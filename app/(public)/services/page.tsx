import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ServicesView, type ServiceView } from "@/components/public/ServicesView";
import { CTABanner } from "@/components/public/CTABanner";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Recruiting, BPO, IT staffing, HR & payroll, executive search, and consulting — delivered from Hyderabad for US businesses.",
};

// Reflect the latest service content managed in the admin portal.
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const rows = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const services: ServiceView[] = rows.map((s) => ({
    slug: s.slug,
    title: s.title,
    shortDesc: s.shortDesc,
    longDesc: s.longDesc,
    benefits: JSON.parse(s.benefits) as string[],
    industries: s.industries
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  }));

  return (
    <>
      <section className="container pt-20 sm:pt-24">
        <SectionHeading
          eyebrow="Services"
          title="Everything you need to hire and operate"
          description="Six practice areas, each delivered by dedicated teams aligned to US business hours. Explore what we do — and how we can plug into the way you already work."
        />
      </section>

      <section className="container">
        <ServicesView services={services} />
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
