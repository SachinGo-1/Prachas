import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { applicationStatusSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { job: { select: { id: true, title: true } } },
  });
  if (!application) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ application });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = applicationStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ application });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
