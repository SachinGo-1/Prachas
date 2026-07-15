import { prisma } from "@/lib/prisma";
import { ServicesManager } from "@/components/admin/ServicesManager";

export const dynamic = "force-dynamic";

function safeParseBenefits(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export default async function AdminServicesPage() {
  const rows = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });

  const services = rows.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    shortDesc: s.shortDesc,
    longDesc: s.longDesc,
    benefits: safeParseBenefits(s.benefits),
    industries: s.industries
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean),
    displayOrder: s.displayOrder,
  }));

  return (
    <div className="max-w-4xl space-y-4">
      <p className="text-sm text-muted-foreground">
        Edit the copy for each service. Changes appear immediately on the public{" "}
        <span className="text-accent">/services</span> page.
      </p>
      <ServicesManager services={services} />
    </div>
  );
}
