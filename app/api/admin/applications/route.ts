import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { APPLICATION_STATUSES } from "@/lib/constants";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.ApplicationWhereInput = {};
  if (jobId) where.jobId = jobId;
  if (status && (APPLICATION_STATUSES as readonly string[]).includes(status)) {
    where.status = status;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      // Include the whole "to" day.
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { job: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ applications });
}
