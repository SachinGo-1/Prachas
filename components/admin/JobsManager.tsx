"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { JobForm, type JobRecord, type JobFormValues } from "@/components/admin/JobForm";
import { useToast } from "@/components/ui/toast";
import { JOB_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export type JobRow = JobRecord & {
  createdAt: string;
  applicantCount: number;
};

const statusVariant: Record<string, "success" | "muted" | "destructive"> = {
  active: "success",
  draft: "muted",
  closed: "destructive",
};

export function JobsManager({ jobs }: { jobs: JobRow[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<JobRow | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<JobRow | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [statusBusyId, setStatusBusyId] = React.useState<string | null>(null);

  // Open the create dialog when arriving from the dashboard "Post Job" link.
  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditing(null);
      setFormOpen(true);
    }
  }, [searchParams]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (job: JobRow) => {
    setEditing(job);
    setFormOpen(true);
  };

  const handleSubmit = async (values: JobFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        editing ? `/api/admin/jobs/${editing.id}` : "/api/admin/jobs",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast({
        variant: "success",
        title: editing ? "Job updated" : "Job created",
      });
      setFormOpen(false);
      setEditing(null);
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not save job",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/jobs/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ variant: "success", title: "Job deleted" });
      setDeleteTarget(null);
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not delete job",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusChange = async (job: JobRow, status: string) => {
    setStatusBusyId(job.id);
    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      router.refresh();
    } catch {
      toast({ variant: "error", title: "Could not update status" });
    } finally {
      setStatusBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-muted">
          {jobs.length} {jobs.length === 1 ? "posting" : "postings"}
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Post Job
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Posted</TableHead>
              <TableHead className="text-center">Applicants</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-12 text-center text-brand-muted">
                  No job postings yet. Click “Post Job” to create one.
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div className="font-medium text-brand-ink">{job.title}</div>
                    <div className="text-xs capitalize text-brand-muted">
                      {job.type}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-brand-muted">
                    {job.department}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-brand-muted">
                    {job.location}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={statusVariant[job.status] ?? "muted"}
                        className="capitalize"
                      >
                        {job.status}
                      </Badge>
                    </div>
                    <select
                      aria-label={`Change status for ${job.title}`}
                      value={job.status}
                      disabled={statusBusyId === job.id}
                      onChange={(e) => handleStatusChange(job, e.target.value)}
                      className="mt-1 rounded border border-input bg-background px-1.5 py-0.5 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {JOB_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-brand-muted">
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {job.applicantCount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${job.title}`}
                        onClick={() => openEdit(job)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${job.title}`}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(job)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / edit dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit job" : "Post a new job"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the details for this posting."
                : "Fill in the details to publish a new job posting."}
            </DialogDescription>
          </DialogHeader>
          <JobForm
            key={editing?.id ?? "new"}
            job={editing}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete job posting?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-brand-ink">
                {deleteTarget?.title}
              </span>{" "}
              and all {deleteTarget?.applicantCount} of its applications. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
