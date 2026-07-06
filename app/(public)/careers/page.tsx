import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { CareersList, type JobCardData } from "@/components/public/CareersList";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Prachas Technologies in Hyderabad. Explore open roles in recruiting, IT staffing, and consulting.",
};

export const dynamic = "force-dynamic";

export default async function CareersPage() {
  const jobs = await prisma.jobPosting.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });

  const jobData: JobCardData[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    type: j.type,
    salaryRange: j.salaryRange,
    description: j.description,
    requirements: j.requirements,
    createdAt: j.createdAt.toISOString(),
  }));

  return (
    <>
      <section className="border-b bg-brand-surface">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow="Careers"
            title="Build your career at Prachas"
            description="We hire curious, dependable people who care about doing great work for our clients. Work with a US-focused team from our Hyderabad HQ, with growth, mentorship, and real ownership."
          />
        </div>
      </section>

      <section className="container py-16 sm:py-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-ink">
            Open positions{" "}
            <span className="font-mono text-brand-muted">
              ({jobData.length})
            </span>
          </h2>
        </div>
        <CareersList jobs={jobData} />
      </section>
    </>
  );
}
