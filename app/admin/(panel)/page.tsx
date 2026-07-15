import Link from "next/link";
import {
  Briefcase,
  ClipboardList,
  Inbox,
  FileText,
  Plus,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { KPICard } from "@/components/admin/KPICard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

type ActivityItem = {
  id: string;
  kind: "application" | "inquiry";
  name: string;
  detail: string;
  createdAt: Date;
};

export default async function DashboardPage() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    activeJobs,
    appsThisMonth,
    unreadInquiries,
    publishedPosts,
    latestApplications,
    latestInquiries,
  ] = await Promise.all([
    prisma.jobPosting.count({ where: { status: "active" } }),
    prisma.application.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.blogPost.count({ where: { status: "published" } }),
    prisma.application.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
    }),
    prisma.inquiry.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
  ]);

  // Merge applications + inquiries into a single recent-activity feed.
  const activity: ActivityItem[] = [
    ...latestApplications.map((a) => ({
      id: a.id,
      kind: "application" as const,
      name: a.name,
      detail: a.job?.title ?? "General application",
      createdAt: a.createdAt,
    })),
    ...latestInquiries.map((i) => ({
      id: i.id,
      kind: "inquiry" as const,
      name: i.name,
      detail: i.serviceInterest,
      createdAt: i.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Welcome back — here&apos;s what&apos;s happening at Prachas.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="accent">
            <Link href="/admin/jobs?new=1">
              <Plus className="h-4 w-4" />
              New Job
            </Link>
          </Button>
          <Button asChild size="sm" variant="accentOutline">
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/inquiries">View Inquiries</Link>
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Active Job Postings" value={activeJobs} icon={Briefcase} />
        <KPICard
          label="Applications This Month"
          value={appsThisMonth}
          icon={ClipboardList}
        />
        <KPICard
          label="Unread Inquiries"
          value={unreadInquiries}
          icon={Inbox}
          accent
        />
        <KPICard
          label="Blog Posts Published"
          value={publishedPosts}
          icon={FileText}
        />
      </div>

      {/* Recent activity */}
      <section className="rounded-xl border border-border bg-bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display font-semibold text-foreground">
            Recent Activity
          </h2>
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent-dim"
          >
            View applications <ArrowRight className="h-4 w-4" />
          </Link>
        </header>
        <ul className="divide-y divide-border">
          {activity.length === 0 ? (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">
              No activity yet.
            </li>
          ) : (
            activity.map((item) => (
              <li
                key={`${item.kind}-${item.id}`}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Badge
                    variant={item.kind === "application" ? "accent" : "secondary"}
                    className="shrink-0 capitalize"
                  >
                    {item.kind}
                  </Badge>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatDateTime(item.createdAt)}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
