"use client";

import * as React from "react";
import { MapPin, Briefcase, Building2, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ApplyForm } from "@/components/public/ApplyForm";
import { formatDate } from "@/lib/utils";

export type JobCardData = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string | null;
  description: string;
  requirements: string;
  createdAt: string;
};

export function CareersList({ jobs }: { jobs: JobCardData[] }) {
  const [activeJob, setActiveJob] = React.useState<JobCardData | null>(null);

  if (jobs.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-12 text-center">
        <p className="text-brand-muted">
          There are no open positions right now. Check back soon, or{" "}
          <a
            href="/contact"
            className="font-medium text-brand-navy underline underline-offset-4"
          >
            reach out
          </a>{" "}
          — we&apos;re always interested in great people.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-brand-ink">
                    {job.title}
                  </h3>
                  <Badge variant="accent" className="capitalize">
                    {job.type}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {job.department}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  {job.salaryRange && (
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {job.salaryRange}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    Posted {formatDate(job.createdAt)}
                  </span>
                </div>
              </div>
              <Button
                variant="accent"
                className="shrink-0"
                onClick={() => setActiveJob(job)}
              >
                Apply Now
              </Button>
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-brand-muted">
              {job.description}
            </p>
          </li>
        ))}
      </ul>

      <Dialog
        open={!!activeJob}
        onOpenChange={(open) => !open && setActiveJob(null)}
      >
        <DialogContent>
          {activeJob && (
            <>
              <DialogHeader>
                <DialogTitle>Apply — {activeJob.title}</DialogTitle>
                <DialogDescription>
                  {activeJob.department} · {activeJob.location}
                </DialogDescription>
              </DialogHeader>
              <ApplyForm
                jobId={activeJob.id}
                jobTitle={activeJob.title}
                onSuccess={() => setActiveJob(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
