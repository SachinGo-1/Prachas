import { prisma } from "@/lib/prisma";
import { ApplicationsManager } from "@/components/admin/ApplicationsManager";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return <ApplicationsManager jobOptions={jobs} />;
}
