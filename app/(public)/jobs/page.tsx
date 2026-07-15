import type { Metadata } from "next";
import { SectionHeading } from "@/components/public/SectionHeading";
import { JobsList } from "@/components/public/JobsList";
import { type JobCardData } from "@/components/public/JobCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Explore open positions at Prachas Technologies. Join our US-focused recruiting, technology, and operations teams from our Hyderabad HQ.",
};

export const dynamic = "force-dynamic";

export default async function JobsPage() {
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
    <section className="container py-20 sm:py-24">
      <SectionHeading
        eyebrow="Careers"
        title="Open Positions"
        description="Find your next role with a team that pairs deep US-market knowledge with the energy of our Hyderabad headquarters. Filter by department, location, and type."
      />
      <div className="mt-12">
        <JobsList jobs={jobData} />
      </div>
    </section>
  );
}
