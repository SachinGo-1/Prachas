import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { blogSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { coverImage, tags, status, slug, ...rest } = parsed.data;

  // If the slug changed, make sure it isn't taken by another post.
  if (slug !== existing.slug) {
    const dupe = await prisma.blogPost.findUnique({ where: { slug } });
    if (dupe && dupe.id !== existing.id) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }
  }

  // Stamp publishedAt the first time a post goes live; keep it thereafter.
  let publishedAt = existing.publishedAt;
  if (status === "published" && !existing.publishedAt) {
    publishedAt = new Date();
  }

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data: {
      ...rest,
      slug,
      coverImage: coverImage || null,
      tags: tags ?? "",
      status,
      publishedAt,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    await prisma.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
