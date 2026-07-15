import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "@/components/public/SectionHeading";
import { BlogCard } from "@/components/public/BlogCard";
import { prisma } from "@/lib/prisma";
import { BLOG_FILTERS, BLOG_POSTS_PER_PAGE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on recruiting, HR, technology, and industry news from the team at Prachas Technologies.",
};

export const dynamic = "force-dynamic";

/** Build a /blog href that preserves the active category filter. */
function buildHref(category: string, page: number) {
  const params = new URLSearchParams();
  if (category && category !== "All") params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/blog?${qs}` : "/blog";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const category = searchParams.category ?? "All";
  const requestedPage = Number(searchParams.page);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

  const where = {
    status: "published",
    ...(category && category !== "All" ? { category } : {}),
  };

  const [total, posts] = await Promise.all([
    prisma.blogPost.count({ where }),
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * BLOG_POSTS_PER_PAGE,
      take: BLOG_POSTS_PER_PAGE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / BLOG_POSTS_PER_PAGE));

  return (
    <>
      <section className="border-b border-border">
        <div className="container py-16 sm:py-20">
          <SectionHeading
            eyebrow="Insights"
            title="The Prachas Blog"
            description="Practical takes on recruiting, HR, and technology — written by the team building the bridge between Indian talent and American ambition."
          />
        </div>
      </section>

      <section className="container py-12 sm:py-16">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          {BLOG_FILTERS.map((filter) => {
            const active = filter === category;
            return (
              <Link
                key={filter}
                href={buildHref(filter, 1)}
                className={cn(
                  "rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-label transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
                )}
                aria-current={active ? "page" : undefined}
              >
                {filter}
              </Link>
            );
          })}
        </div>

        {/* Post grid */}
        {posts.length === 0 ? (
          <div className="mt-12 rounded-xl border border-border bg-bg-card p-12 text-center">
            <p className="font-display text-lg font-semibold text-foreground">
              No posts yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {category !== "All"
                ? `There are no published posts in “${category}” yet. Check back soon.`
                : "New articles are on the way — check back soon."}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="mt-12 flex items-center justify-center gap-2"
            aria-label="Blog pagination"
          >
            {page > 1 ? (
              <Link
                href={buildHref(category, page - 1)}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-40">
                <ChevronLeft className="h-4 w-4" />
                Prev
              </span>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === page;
              return (
                <Link
                  key={n}
                  href={buildHref(category, n)}
                  className={cn(
                    "inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 font-mono text-sm transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "border border-border text-muted-foreground hover:border-accent hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {n}
                </Link>
              );
            })}

            {page < totalPages ? (
              <Link
                href={buildHref(category, page + 1)}
                className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm text-muted-foreground opacity-40">
                Next
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </nav>
        )}
      </section>
    </>
  );
}
