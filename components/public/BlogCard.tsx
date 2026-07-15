import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

export type BlogCardData = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  coverImage: string | null;
  author: string;
  publishedAt: string | Date | null;
  createdAt: string | Date;
};

export function BlogCard({ post }: { post: BlogCardData }) {
  const date = post.publishedAt ?? post.createdAt;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-bg-card transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* Cover image (or a branded placeholder) */}
      <div className="relative aspect-[16/9] overflow-hidden bg-bg-raised">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center dot-grid">
            <span className="font-display text-3xl font-extrabold text-accent/20">
              PRACHAS
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <span className="font-mono text-xs uppercase tracking-label text-accent">
          {post.category}
        </span>
        <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-foreground">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
          <span>
            {post.author} · {formatDate(date)}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-accent">
            Read more
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
