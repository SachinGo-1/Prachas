import type { Metadata } from "next";
import { Target, Handshake, Users, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";
import { StatsBar } from "@/components/public/StatsBar";
import { CTABanner } from "@/components/public/CTABanner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { VALUES, TIMELINE, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in 2013 in Hyderabad, Prachas Technologies has spent over a decade connecting US businesses with India's best talent.",
};

// Always reflect the latest team data managed in the admin portal.
export const dynamic = "force-dynamic";

const VALUE_ICONS: LucideIcon[] = [Target, Handshake, Users];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function AboutPage() {
  const team = await prisma.teamMember.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <>
      {/* Mission statement */}
      <section className="container py-20 sm:py-28">
        <p className="font-mono text-xs font-medium uppercase tracking-label text-accent">
          About {SITE.shortName}
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-display font-bold tracking-tight text-foreground">
          We give American businesses an offshore partner that operates with the{" "}
          <span className="text-accent">
            precision and accountability of an in-house team
          </span>
          .
        </h1>
      </section>

      {/* Our Story */}
      <section className="border-y border-border bg-bg-card">
        <div className="container py-20 sm:py-24">
          <SectionHeading eyebrow="Our Story" title="A decade bridging two markets" />
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Timeline */}
            <ol className="relative space-y-10 border-l-2 border-border pl-8">
              {TIMELINE.map((item) => (
                <li key={item.year} className="relative">
                  <span
                    className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg-card"
                    aria-hidden
                  />
                  <div className="font-mono text-sm font-bold text-accent">
                    {item.year}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            {/* Narrative */}
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                {SITE.name} was founded in {SITE.foundedYear} in Hyderabad, India,
                with a simple conviction: American businesses deserve an offshore
                partner that operates with the precision, communication, and
                accountability of an in-house team.
              </p>
              <p>
                Over 11 years, we&apos;ve grown from a small recruiting shop into a
                full-service staffing, BPO, and consulting firm — serving 50+ US
                clients across technology, healthcare, and financial services with
                a 98% client retention rate.
              </p>
              <p>
                Our teams work aligned to US business hours, so collaboration feels
                local rather than offshore, and our processes are built with data
                security and compliance in mind from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container py-20 sm:py-24">
        <SectionHeading
          align="center"
          eyebrow="What We Stand For"
          title="Our values"
          description="The principles that shape how we work with clients, candidates, and each other."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {VALUES.map((value, i) => {
            const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
            return (
              <div
                key={value.title}
                className="rounded-xl border border-border bg-bg-card p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-border bg-bg-card">
        <div className="container py-20 sm:py-24">
          <SectionHeading
            align="center"
            eyebrow="Our People"
            title="Meet the team"
            description="The people who make Prachas tick."
          />
          {team.length === 0 ? (
            <p className="mt-12 text-center text-muted-foreground">
              Team members will appear here soon.
            </p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center rounded-xl border border-border bg-bg-raised p-8 text-center"
                >
                  {member.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-accent/15 text-lg text-accent">
                        {initials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <h3 className="mt-4 font-display font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-label text-muted-foreground">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* By the Numbers */}
      <StatsBar />

      <div className="py-20 sm:py-24">
        <CTABanner
          title="Want to work with us?"
          subtitle="Whether you're hiring or looking to join, we'd love to hear from you."
          buttonLabel="Get in touch"
        />
      </div>
    </>
  );
}
