"use client";

import * as React from "react";
import Link from "next/link";
import { JobCard, type JobCardData } from "@/components/public/JobCard";
import { ApplicationModal } from "@/components/public/ApplicationModal";
import { EMPLOYMENT_TYPES } from "@/lib/constants";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto";

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function JobsList({ jobs }: { jobs: JobCardData[] }) {
  const [activeJob, setActiveJob] = React.useState<JobCardData | null>(null);
  const [department, setDepartment] = React.useState("All");
  const [location, setLocation] = React.useState("All");
  const [type, setType] = React.useState("All");

  const departments = React.useMemo(
    () => Array.from(new Set(jobs.map((j) => j.department))).sort(),
    [jobs]
  );
  const locations = React.useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );

  const filtered = jobs.filter(
    (j) =>
      (department === "All" || j.department === department) &&
      (location === "All" || j.location === location) &&
      (type === "All" || j.type === type)
  );

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <select
          className={selectClass}
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          aria-label="Filter by department"
        >
          <option value="All">All departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Filter by location"
        >
          <option value="All">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by employment type"
        >
          <option value="All">All types</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {capitalize(t)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-bg-card p-12 text-center">
          <p className="text-muted-foreground">
            No open positions right now — check back soon or{" "}
            <Link
              href="/join-us"
              className="font-medium text-accent underline underline-offset-4"
            >
              send us your resume
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onApply={setActiveJob} />
          ))}
        </ul>
      )}

      <ApplicationModal
        job={activeJob}
        open={!!activeJob}
        onClose={() => setActiveJob(null)}
      />
    </>
  );
}
