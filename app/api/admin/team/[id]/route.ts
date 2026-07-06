import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { teamMemberSchema } from "@/lib/validations";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = teamMemberSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.role !== undefined) data.role = parsed.data.role;
  if (parsed.data.bio !== undefined) data.bio = parsed.data.bio || null;
  if (parsed.data.photoUrl !== undefined)
    data.photoUrl = parsed.data.photoUrl || null;
  if (parsed.data.displayOrder !== undefined)
    data.displayOrder = parsed.data.displayOrder;

  try {
    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ member });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    await prisma.teamMember.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
