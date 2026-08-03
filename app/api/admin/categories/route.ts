import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { categorySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ categories });
  } catch (err) {
    console.error("[categories] list failed:", err);
    return NextResponse.json(
      { error: "Could not load categories." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const name = parsed.data.name.trim();

  try {
    const existing = await prisma.category.findFirst({
      where: { name },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A category with that name already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: { name, displayOrder: parsed.data.displayOrder ?? 0 },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    console.error("[categories] create failed:", err);
    return NextResponse.json(
      { error: "Could not create the category." },
      { status: 500 }
    );
  }
}
