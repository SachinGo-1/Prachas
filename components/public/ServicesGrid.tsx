import { SERVICES } from "@/lib/constants";
import { ServiceCard } from "@/components/public/ServiceCard";
import { cn } from "@/lib/utils";

/**
 * Home-page services teaser. Shows the first `limit` services from the
 * static SERVICES source (kept in sync with the DB seed).
 */
export function ServicesGrid({
  className,
  limit = 3,
}: {
  className?: string;
  limit?: number;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {SERVICES.slice(0, limit).map((service) => (
        <ServiceCard
          key={service.slug}
          title={service.title}
          short={service.short}
          href={`/services#${service.slug}`}
          icon={service.icon}
        />
      ))}
    </div>
  );
}
