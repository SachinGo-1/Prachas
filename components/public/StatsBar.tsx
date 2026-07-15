import { STATS } from "@/lib/constants";

export function StatsBar() {
  return (
    <section className="border-y border-border bg-bg-raised" aria-label="Company statistics">
      <div className="container grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="font-mono text-4xl font-bold text-accent sm:text-5xl">
              {stat.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
