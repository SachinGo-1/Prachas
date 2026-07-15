"use client";

import * as React from "react";
import { Download, FileText, Filter, Loader2, X } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { APPLICATION_STATUSES, JOB_DEPARTMENTS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type Application = {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string | null;
  resumeUrl: string;
  coverNote: string | null;
  status: string;
  createdAt: string;
  job: { id: string; title: string } | null;
};

const statusVariant: Record<
  string,
  "warning" | "default" | "success" | "destructive"
> = {
  new: "warning",
  reviewed: "default",
  shortlisted: "success",
  rejected: "destructive",
};

const selectClass =
  "h-9 rounded-md border border-border bg-bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ApplicationsManager({
  jobOptions,
}: {
  jobOptions: { id: string; title: string }[];
}) {
  const { toast } = useToast();
  const [apps, setApps] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [detail, setDetail] = React.useState<Application | null>(null);
  const [bulkStatus, setBulkStatus] = React.useState("");
  const [bulkBusy, setBulkBusy] = React.useState(false);

  const [filters, setFilters] = React.useState({
    jobId: "",
    status: "",
    department: "",
    from: "",
    to: "",
  });

  const buildParams = React.useCallback(() => {
    const params = new URLSearchParams();
    if (filters.jobId) params.set("jobId", filters.jobId);
    if (filters.status) params.set("status", filters.status);
    if (filters.department) params.set("department", filters.department);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);
    return params;
  }, [filters]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?${buildParams().toString()}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setApps(data.applications);
      setSelected(new Set());
    } catch {
      toast({ variant: "error", title: "Could not load applications" });
    } finally {
      setLoading(false);
    }
  }, [buildParams, toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
    } catch {
      toast({ variant: "error", title: "Could not update status" });
      load();
    }
  };

  const applyBulk = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setBulkBusy(true);
    try {
      const res = await fetch("/api/admin/applications/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selected], status: bulkStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast({
        variant: "success",
        title: `Updated ${selected.size} application(s)`,
      });
      setBulkStatus("");
      await load();
    } catch {
      toast({ variant: "error", title: "Bulk update failed" });
    } finally {
      setBulkBusy(false);
    }
  };

  const toggleAll = () => {
    if (selected.size === apps.length) setSelected(new Set());
    else setSelected(new Set(apps.map((a) => a.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Download via the dedicated export endpoint (respects current filters).
  const exportCsv = () => {
    window.location.href = `/api/admin/applications/export?${buildParams().toString()}`;
  };

  const hasFilters =
    filters.jobId ||
    filters.status ||
    filters.department ||
    filters.from ||
    filters.to;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4 text-accent" />
          Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <select
            aria-label="Filter by job"
            value={filters.jobId}
            onChange={(e) => setFilters((f) => ({ ...f, jobId: e.target.value }))}
            className={selectClass}
          >
            <option value="">All jobs</option>
            {jobOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by department"
            value={filters.department}
            onChange={(e) =>
              setFilters((f) => ({ ...f, department: e.target.value }))
            }
            className={selectClass}
          >
            <option value="">All departments</option>
            {JOB_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
            className={`${selectClass} capitalize`}
          >
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            aria-label="From date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            className={selectClass}
          />
          <input
            type="date"
            aria-label="To date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            className={selectClass}
          />
          <div className="flex gap-2">
            {hasFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    jobId: "",
                    status: "",
                    department: "",
                    from: "",
                    to: "",
                  })
                }
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            {apps.length} application{apps.length === 1 ? "" : "s"}
          </p>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-bg-card px-2 py-1">
              <span className="text-xs text-muted-foreground">
                {selected.size} selected
              </span>
              <select
                aria-label="Bulk status"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="h-8 rounded border border-border bg-bg-card px-1.5 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Set status…</option>
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <Button
                size="sm"
                variant="accent"
                onClick={applyBulk}
                disabled={!bulkStatus || bulkBusy}
              >
                {bulkBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={exportCsv}
          disabled={apps.length === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox
                  aria-label="Select all"
                  checked={apps.length > 0 && selected.size === apps.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead className="hidden md:table-cell">Applied For</TableHead>
              <TableHead className="hidden lg:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Applied</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="py-16 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : apps.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-muted-foreground"
                >
                  No applications match your filters.
                </TableCell>
              </TableRow>
            ) : (
              apps.map((a) => (
                <TableRow
                  key={a.id}
                  className="cursor-pointer"
                  onClick={() => setDetail(a)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      aria-label={`Select ${a.name}`}
                      checked={selected.has(a.id)}
                      onCheckedChange={() => toggleOne(a.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-foreground">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {a.job?.title ?? "General"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {a.department ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDateTime(a.createdAt)}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={statusVariant[a.status] ?? "default"}
                        className="w-fit capitalize"
                      >
                        {a.status}
                      </Badge>
                      <select
                        aria-label={`Change status for ${a.name}`}
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                        className="rounded border border-border bg-bg-card px-1.5 py-0.5 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.name}</DialogTitle>
                <DialogDescription>
                  Applied for {detail.job?.title ?? "General application"} ·{" "}
                  {formatDateTime(detail.createdAt)}
                </DialogDescription>
              </DialogHeader>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${detail.email}`}
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      {detail.email}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd>{detail.phone}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Department</dt>
                  <dd>{detail.department ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge
                      variant={statusVariant[detail.status] ?? "default"}
                      className="capitalize"
                    >
                      {detail.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="mb-1 text-muted-foreground">Cover note</dt>
                  <dd className="whitespace-pre-wrap rounded-md bg-secondary p-3 text-foreground">
                    {detail.coverNote || "—"}
                  </dd>
                </div>
              </dl>
              <Button asChild variant="accent" className="w-full">
                <a href={detail.resumeUrl} target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4" />
                  Download resume
                </a>
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
