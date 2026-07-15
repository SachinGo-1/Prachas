import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ApplyForm } from "@/components/public/ApplyForm";
import { prisma } from "@/lib/prisma";
import { JOIN_BENEFITS, HIRING_STEPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Join Us",
  description:
    "Build your career with Prachas Technologies in Hyderabad. Explore our culture, how we hire, and send us your application.",
};

export const dynamic = "force-dynamic";

export default async function JoinUsPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { status: "active" },
    orderBy: { title: "asc" },
    select: { id: true, title: true, department: true },
  });

  return (
    <>
      {/* Hero */}
      <section className="container py-20 sm:py-28">
        <p className="font-mono text-xs font-medium uppercase tracking-label text-accent">
          Join Us
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-display font-bold tracking-tight text-foreground">
          Build Your Career With <span className="text-accent">Prachas</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          From our headquarters in Hyderabad, our teams work shoulder to shoulder
          with US businesses — solving real problems and owning real
          relationships. We invest in your growth with mentorship, clear
          progression, and the kind of global exposure that accelerates careers.
          If you&apos;re curious, dependable, and want your work to matter, you&apos;ll
          feel at home here.
        </p>
      </section>

      {/* Why Join Us */}
      <section className="border-y border-border bg-bg-card">
        <div className="container py-20 sm:py-24">
          <SectionHeading
            eyebrow="Why Join Us"
            title="A place to do your best work"
            description="We build teams the way we build for our clients — with care, accountability, and room to grow."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {JOIN_BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-border bg-bg-raised p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {benefit.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Hire */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          eyebrow="How We Hire"
          title="A clear, respectful process"
          description="Four straightforward steps — no black boxes, no endless loops."
        />

        {/* Desktop: horizontal indicator with connecting line */}
        <ol className="mt-14 hidden md:flex md:items-start">
          {HIRING_STEPS.map((item, i) => (
            <li key={item.step} className="relative flex-1">
              {i < HIRING_STEPS.length - 1 && (
                <span
                  className="absolute left-1/2 top-5 h-0.5 w-full bg-border"
                  aria-hidden
                />
              )}
              <div className="relative flex flex-col items-center text-center">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-accent-foreground">
                  {item.step}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Mobile: vertical stack */}
        <ol className="mt-10 space-y-6 md:hidden">
          {HIRING_STEPS.map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-sm font-bold text-accent-foreground">
                {item.step}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Application form */}
      <section className="border-t border-border bg-bg-card">
        <div className="container py-20 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <SectionHeading
              eyebrow="Apply"
              title="Send us your application"
              description="Applying for a specific role or introducing yourself for the future — we'd love to hear from you."
            />
            <div className="mt-8 rounded-2xl border border-border bg-bg-raised p-6 sm:p-8">
              <ApplyForm jobs={jobs} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
