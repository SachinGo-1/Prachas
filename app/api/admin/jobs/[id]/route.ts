import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { jobSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const job = await prisma.jobPosting.findUnique({
    where: { id: params.id },
    include: { _count: { select: { applications: true } } },
  });
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ job });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  // Allow partial updates (e.g. toggling status inline).
  const parsed = jobSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { closingDate, salaryRange, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (salaryRange !== undefined) data.salaryRange = salaryRange || null;
  if (closingDate !== undefined) {
    data.closingDate = closingDate ? new Date(closingDate) : null;
  }

  try {
    const job = await prisma.jobPosting.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ job });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    await prisma.jobPosting.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
