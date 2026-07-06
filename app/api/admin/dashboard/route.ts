import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalJobs,
    activeJobs,
    openApplications,
    recentInquiries,
    unreadInquiries,
    latestApplications,
    latestInquiries,
  ] = await Promise.all([
    prisma.jobPosting.count(),
    prisma.jobPosting.count({ where: { status: "active" } }),
    prisma.application.count({ where: { status: { in: ["new", "reviewed", "shortlisted"] } } }),
    prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
    }),
    prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    kpis: {
      totalJobs,
      activeJobs,
      openApplications,
      recentInquiries,
      unreadInquiries,
    },
    latestApplications,
    latestInquiries,
  });
}
