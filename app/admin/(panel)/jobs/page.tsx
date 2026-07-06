import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { JobsManager, type JobRow } from "@/components/admin/JobsManager";

export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  const rows: JobRow[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    type: j.type,
    description: j.description,
    requirements: j.requirements,
    salaryRange: j.salaryRange,
    status: j.status,
    closingDate: j.closingDate ? j.closingDate.toISOString() : null,
    createdAt: j.createdAt.toISOString(),
    applicantCount: j._count.applications,
  }));

  return (
    <Suspense>
      <JobsManager jobs={rows} />
    </Suspense>
  );
}
