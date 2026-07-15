"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { jobSchema, type JobInput } from "@/lib/validations";
import { EMPLOYMENT_TYPES, JOB_STATUSES, JOB_DEPARTMENTS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/public/FieldError";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-bg-card px-3 py-2 text-sm capitalize ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export type JobFormValues = JobInput;

export type JobRecord = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  salaryRange: string | null;
  status: string;
  closingDate: string | null;
};

export function JobForm({
  job,
  onSubmit,
  submitting,
}: {
  job?: JobRecord | null;
  onSubmit: (values: JobFormValues) => void | Promise<void>;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title ?? "",
      department: (job?.department as JobInput["department"]) ?? "Recruiting",
      location: job?.location ?? "",
      type: (job?.type as JobInput["type"]) ?? "full-time",
      description: job?.description ?? "",
      requirements: job?.requirements ?? "",
      salaryRange: job?.salaryRange ?? "",
      status: (job?.status as JobInput["status"]) ?? "active",
      closingDate: job?.closingDate ? job.closingDate.slice(0, 10) : "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="jf-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input id="jf-title" {...register("title")} aria-invalid={!!errors.title} />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="jf-department">
            Department <span className="text-destructive">*</span>
          </Label>
          <select
            id="jf-department"
            className={selectClass}
            {...register("department")}
            aria-invalid={!!errors.department}
          >
            {JOB_DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError message={errors.department?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jf-location">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="jf-location"
            {...register("location")}
            aria-invalid={!!errors.location}
          />
          <FieldError message={errors.location?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="jf-type">Employment type</Label>
          <select id="jf-type" className={selectClass} {...register("type")}>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jf-status">Status</Label>
          <select id="jf-status" className={selectClass} {...register("status")}>
            {JOB_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="jf-closing">Closing date</Label>
          <Input
            id="jf-closing"
            type="date"
            {...register("closingDate")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jf-salary">Salary range</Label>
        <Input
          id="jf-salary"
          placeholder="e.g. ₹18–28 LPA (optional)"
          {...register("salaryRange")}
        />
        <FieldError message={errors.salaryRange?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jf-description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="jf-description"
          rows={5}
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="jf-requirements">
          Requirements <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="jf-requirements"
          rows={5}
          placeholder="One requirement per line"
          {...register("requirements")}
          aria-invalid={!!errors.requirements}
        />
        <FieldError message={errors.requirements?.message} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : job ? (
            "Save changes"
          ) : (
            "Create job"
          )}
        </Button>
      </div>
    </form>
  );
}
