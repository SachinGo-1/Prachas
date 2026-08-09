import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: { _count: { select: { posts: true } } },
    });
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Refuse rather than silently stripping the category off live posts.
    if (category._count.posts > 0) {
      return NextResponse.json(
        {
          error: `“${category.name}” is used by ${category._count.posts} post${
            category._count.posts === 1 ? "" : "s"
          }.`,
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
