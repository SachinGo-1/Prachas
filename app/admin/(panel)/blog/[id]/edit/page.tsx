import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BlogForm, type BlogRecord } from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  const record: BlogRecord = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: post.category,
    excerpt: post.excerpt,
    body: post.body,
    coverImage: post.coverImage,
    author: post.author,
    tags: post.tags,
    status: post.status,
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold text-foreground">
          Edit Post
        </h1>
      </div>
      <BlogForm post={record} />
    </div>
  );
}
