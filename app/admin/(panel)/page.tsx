import Link from "next/link";
import {
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  Plus,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { KPICard } from "@/components/admin/KPICard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalJobs,
    openApplications,
    recentInquiries,
    unreadInquiries,
    latestApplications,
    latestInquiries,
  ] = await Promise.all([
    prisma.jobPosting.count(),
    prisma.application.count({
      where: { status: { in: ["new", "reviewed", "shortlisted"] } },
    }),
    prisma.inquiry.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.inquiry.count({ where: { isRead: false, isArchived: false } }),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { job: { select: { title: true } } },
    }),
    prisma.inquiry.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-brand-muted">
          Welcome back — here&apos;s what&apos;s happening at Prachas.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/jobs?new=1">
              <Plus className="h-4 w-4" />
              Post Job
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/inquiries">View Inquiries</Link>
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard label="Total Job Postings" value={totalJobs} icon={Briefcase} />
        <KPICard label="Open Applications" value={openApplications} icon={Users} />
        <KPICard
          label="Inquiries (30 days)"
          value={recentInquiries}
          icon={MessageSquare}
        />
        <KPICard
          label="Unread Messages"
          value={unreadInquiries}
          icon={Mail}
          accent
        />
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card shadow-sm">
          <header className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold text-brand-ink">Recent Applications</h2>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-brand-saffron"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </header>
          <ul className="divide-y">
            {latestApplications.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-brand-muted">
                No applications yet.
              </li>
            ) : (
              latestApplications.map((app) => (
                <li
                  key={app.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-ink">
                      {app.name}
                    </p>
                    <p className="truncate text-xs text-brand-muted">
                      {app.job?.title ?? "—"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-brand-muted">
                      {formatDate(app.createdAt)}
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-xl border bg-card shadow-sm">
          <header className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold text-brand-ink">Recent Inquiries</h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-brand-saffron"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </header>
          <ul className="divide-y">
            {latestInquiries.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-brand-muted">
                No inquiries yet.
              </li>
            ) : (
              latestInquiries.map((inq) => (
                <li
                  key={inq.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-brand-ink">
                      {inq.name}
                      {!inq.isRead && (
                        <span className="ml-2 inline-block h-2 w-2 rounded-full bg-brand-saffron align-middle" />
                      )}
                    </p>
                    <p className="truncate text-xs text-brand-muted">
                      {inq.serviceInterest}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-brand-muted">
                    {formatDate(inq.createdAt)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, "default" | "success" | "warning" | "destructive" | "muted"> = {
    new: "warning",
    reviewed: "default",
    shortlisted: "success",
    rejected: "destructive",
  };
  return (
    <Badge variant={map[status] ?? "muted"} className="capitalize">
      {status}
    </Badge>
  );
}
