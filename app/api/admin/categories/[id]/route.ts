import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { categorySchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    const current = await prisma.category.findUnique({
      where: { id: params.id },
    });
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const name = parsed.data.name?.trim();
    if (name && name !== current.name) {
      const clash = await prisma.category.findFirst({ where: { name } });
      if (clash) {
        return NextResponse.json(
          { error: "A category with that name already exists." },
          { status: 409 }
        );
      }
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (parsed.data.displayOrder !== undefined)
      data.displayOrder = parsed.data.displayOrder;

    // Posts store the category name, so a rename has to carry across or
    // existing posts would point at a category that no longer exists.
    const category = await prisma.$transaction(async (tx) => {
      const updated = await tx.category.update({
        where: { id: params.id },
        data,
      });
      if (name && name !== current.name) {
        await tx.blogPost.updateMany({
          where: { category: current.name },
          data: { category: name },
        });
      }
      return updated;
    });

    return NextResponse.json({ category });
  } catch (err) {
    console.error("[categories] update failed:", err);
    return NextResponse.json(
      { error: "Could not update the category." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
    });
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Refuse rather than orphan posts onto a category that no longer exists.
    const inUse = await prisma.blogPost.count({
      where: { category: category.name },
    });
    if (inUse > 0) {
      return NextResponse.json(
        {
          error: `“${category.name}” is used by ${inUse} post${
            inUse === 1 ? "" : "s"
          }. Move those posts to another category first.`,
        },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[categories] delete failed:", err);
    return NextResponse.json(
      { error: "Could not delete the category." },
      { status: 500 }
    );
  }
}
