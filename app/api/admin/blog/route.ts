import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { blogSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { coverImage, tags, status, ...rest } = parsed.data;

  // Slugs must be unique — surface a 409 the form can map onto the field.
  const existing = await prisma.blogPost.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      coverImage: coverImage || null,
      tags: tags ?? "",
      status,
      publishedAt: status === "published" ? new Date() : null,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
