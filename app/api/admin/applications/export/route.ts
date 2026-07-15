import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { csvCell, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const status = searchParams.get("status");
  const department = searchParams.get("department");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.ApplicationWhereInput = {};
  if (jobId) where.jobId = jobId;
  if (department) where.department = department;
  if (status && (APPLICATION_STATUSES as readonly string[]).includes(status)) {
    where.status = status;
  }
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { job: { select: { title: true } } },
  });

  const header = [
    "Name",
    "Email",
    "Phone",
    "Applied For",
    "Department",
    "Date Applied",
    "Status",
    "Resume URL",
    "Cover Note",
  ];

  const rows = applications.map((a) =>
    [
      a.name,
      a.email,
      a.phone,
      a.job?.title ?? "General",
      a.department ?? "",
      formatDate(a.createdAt),
      a.status,
      a.resumeUrl,
      a.coverNote ?? "",
    ]
      .map(csvCell)
      .join(",")
  );

  const csv = [header.map(csvCell).join(","), ...rows].join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="applications-${formatDate(
        new Date()
      ).replace(/\s+/g, "-")}.csv"`,
    },
  });
}
