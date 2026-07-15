import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";
import { formatDate, parseCommaList } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "published" },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: "Post not found" };
  }
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const tags = parseCommaList(post.tags);

  return (
    <article className="container py-16 sm:py-20">
      <div className="mx-auto max-w-[720px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <header className="mt-8">
          <span className="font-mono text-xs uppercase tracking-label text-accent">
            {post.category}
          </span>
          <h1 className="mt-4 font-display text-display font-bold tracking-tight text-foreground">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border pb-6 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{post.author}</span>
            <span aria-hidden>·</span>
            <span className="font-mono">
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
        </header>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="mt-8 w-full rounded-xl border border-border object-cover"
          />
        )}

        <div className="markdown mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-8">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border bg-bg-raised px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
