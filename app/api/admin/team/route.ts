import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { teamMemberSchema } from "@/lib/validations";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const team = await prisma.teamMember.findMany({
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = teamMemberSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const member = await prisma.teamMember.create({
    data: {
      name: parsed.data.name,
      role: parsed.data.role,
      bio: parsed.data.bio || null,
      photoUrl: parsed.data.photoUrl || null,
      displayOrder: parsed.data.displayOrder ?? 0,
    },
  });
  return NextResponse.json({ member }, { status: 201 });
}
