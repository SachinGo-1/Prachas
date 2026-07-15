import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    activeJobs,
    applicationsThisMonth,
    unreadInquiries,
    publishedPosts,
    latestApplications,
    latestInquiries,
  ] = await Promise.all([
    prisma.jobPosting.count({ where: { status: "active" } }),
    prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
    }),
    prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return NextResponse.json({
    kpis: {
      activeJobs,
      applicationsThisMonth,
      unreadInquiries,
      publishedPosts,
    },
    latestApplications,
    latestInquiries,
  });
}
