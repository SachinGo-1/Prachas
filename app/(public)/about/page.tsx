import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { CTABanner } from "@/components/public/CTABanner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { VALUES, TIMELINE, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in 2013 in Hyderabad, Prachas Technologies has spent over a decade connecting US businesses with India's best talent.",
};

// Always reflect the latest team data managed in the admin portal.
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function AboutPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });

  return (
    <>
      {/* Story */}
      <section className="border-b bg-brand-surface">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow="About Prachas"
            title="A decade of bridging two markets"
          />
          <div className="mt-8 grid gap-6 text-lg leading-relaxed text-brand-muted lg:grid-cols-2">
            <p>
              {SITE.name} was founded in {SITE.foundedYear} in Hyderabad, India,
              with a simple conviction: American businesses deserve an offshore
              partner that operates with the precision, communication, and
              accountability of an in-house team. Over 11 years, we&apos;ve grown
              from a small recruiting shop into a full-service staffing, BPO, and
              consulting firm.
            </p>
            <p>
              Today we serve 50+ US clients across technology, healthcare, and
              financial services — with a 98% client retention rate that reflects
              how seriously we take partnership. Our teams work aligned to US
              business hours, so collaboration feels local, and our processes are
              built with data security and compliance in mind from day one.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="Mission & Values"
          title="What we stand for"
          description="Our mission is to connect US growth with India's talent — responsibly, precisely, and for the long term."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => (
            <div
              key={value.title}
              className="rounded-xl border bg-card p-8 text-center shadow-sm"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-navy font-mono text-lg font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-brand-ink">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-card border-y">
        <div className="container py-20 sm:py-24">
          <SectionHeading
            eyebrow="Our journey"
            title="Key milestones"
          />
          <ol className="mt-12 space-y-8 border-l-2 border-brand-navy/15 pl-6">
            {TIMELINE.map((item) => (
              <li key={item.year} className="relative">
                <span
                  className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-brand-saffron bg-background"
                  aria-hidden
                />
                <div className="font-mono text-sm font-bold text-brand-saffron">
                  {item.year}
                </div>
                <h3 className="mt-1 text-lg font-semibold text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-brand-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="Our people"
          title="Meet the team"
          description="The people who make Prachas tick."
        />
        {team.length === 0 ? (
          <p className="mt-12 text-center text-brand-muted">
            Team members will appear here soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border bg-card p-6 text-center shadow-sm"
              >
                <Avatar className="mx-auto h-20 w-20">
                  {member.photoUrl ? (
                    <AvatarImage src={member.photoUrl} alt={member.name} />
                  ) : null}
                  <AvatarFallback className="text-xl">
                    {initials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 font-semibold text-brand-ink">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-brand-saffron">
                  {member.role}
                </p>
                {member.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                    {member.bio}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="pb-20 sm:pb-24">
        <CTABanner
          title="Want to work with us?"
          subtitle="Whether you're hiring or looking to join, we'd love to hear from you."
          buttonLabel="Get in touch"
        />
      </div>
    </>
  );
}
