import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const serviceInterest = searchParams.get("serviceInterest");
  const status = searchParams.get("status"); // read | unread | archived
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.InquiryWhereInput = {};
  if (serviceInterest) where.serviceInterest = serviceInterest;
  if (status === "read") where.isRead = true;
  if (status === "unread") where.isRead = false;
  if (status === "archived") where.isArchived = true;
  if (status !== "archived") where.isArchived = false;

  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ inquiries });
}
