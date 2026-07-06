import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { APPLICATION_STATUSES } from "@/lib/constants";

const bulkSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(APPLICATION_STATUSES),
});

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = bulkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await prisma.application.updateMany({
    where: { id: { in: parsed.data.ids } },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ ok: true, count: result.count });
}
