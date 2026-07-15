import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const services = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });
  return NextResponse.json({ services });
}
