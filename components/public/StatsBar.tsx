import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <section
      className="border-y bg-card"
      aria-label="Company statistics"
    >
      <div className="container grid grid-cols-2 gap-6 py-10 sm:py-12 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-mono text-3xl font-bold text-brand-navy sm:text-4xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-brand-muted">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
