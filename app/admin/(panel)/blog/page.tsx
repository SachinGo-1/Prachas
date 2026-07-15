import { prisma } from "@/lib/prisma";
import { BlogsManager, type BlogRow } from "@/components/admin/BlogsManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: BlogRow[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    author: p.author,
    status: p.status,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt.toISOString(),
  }));

  return <BlogsManager posts={rows} />;
}
