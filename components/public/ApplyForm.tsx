"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { applicationSchema, type ApplicationInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { FieldError } from "@/components/public/FieldError";
import { JOB_DEPARTMENTS } from "@/lib/constants";

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-bg-card px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type ApplyFormProps = {
  jobId?: string;
  jobTitle?: string;
  department?: string;
  jobs?: { id: string; title: string; department: string }[];
  onSuccess?: () => void;
};

export function ApplyForm({
  jobId,
  jobTitle,
  department,
  jobs,
  onSuccess,
}: ApplyFormProps) {
  const { toast } = useToast();
  const [resume, setResume] = React.useState<File | null>(null);
  const [resumeError, setResumeError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isJoinMode = Array.isArray(jobs);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobId: jobId ?? "",
      name: "",
      email: "",
      phone: "",
      department: department ?? "",
      coverNote: "",
    },
  });

  // Register jobId so its value flows through react-hook-form (Join Us mode
  // renders a select for it; modal mode keeps it as a fixed default).
  const jobIdField = register("jobId");

  const validateResume = (file: File | null): boolean => {
    if (!file) {
      setResumeError("Please attach your resume (PDF).");
      return false;
    }
    if (file.type !== "application/pdf") {
      setResumeError("Resume must be a PDF file.");
      return false;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setResumeError("Resume must be smaller than 5MB.");
      return false;
    }
    setResumeError(null);
    return true;
  };

  const onSubmit = async (values: ApplicationInput) => {
    if (!validateResume(resume)) return;

    // The endpoint depends on whether a concrete job is targeted. In modal
    // mode that's the fixed prop; in Join Us mode it's the selected option.
    const currentJobId = isJoinMode ? values.jobId ?? "" : jobId ?? "";
    const endpoint = currentJobId
      ? `/api/jobs/${currentJobId}/apply`
      : "/api/join-us/apply";

    const roleName = currentJobId
      ? jobs?.find((j) => j.id === currentJobId)?.title ??
        jobTitle ??
        "this role"
      : "your general application";

    try {
      const fd = new FormData();
      fd.append("jobId", currentJobId);
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("department", values.department || "");
      fd.append("coverNote", values.coverNote || "");
      fd.append("resume", resume as File);

      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }

      toast({
        variant: "success",
        title: "Application submitted",
        description: `Thanks for applying — we received ${roleName} and will be in touch.`,
      });

      reset({
        jobId: jobId ?? "",
        name: "",
        email: "",
        phone: "",
        department: department ?? "",
        coverNote: "",
      });
      setResume(null);
      setResumeError(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      onSuccess?.();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not submit application",
        description:
          err instanceof Error ? err.message : "Please try again later.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ap-name">
          Full name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ap-name"
          {...register("name")}
          aria-invalid={!!errors.name}
          placeholder="Jane Doe"
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ap-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ap-email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
            placeholder="jane@email.com"
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ap-phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ap-phone"
            {...register("phone")}
            aria-invalid={!!errors.phone}
            placeholder="+91 98765 43210"
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      {/* Role applying for */}
      {isJoinMode ? (
        <div className="space-y-2">
          <Label htmlFor="ap-role">Role applying for</Label>
          <select
            id="ap-role"
            className={selectClass}
            {...jobIdField}
            onChange={(e) => {
              jobIdField.onChange(e);
              const match = jobs?.find((j) => j.id === e.target.value);
              if (match) setValue("department", match.department);
            }}
          >
            <option value="">General Application</option>
            {jobs?.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      ) : (
        jobId && (
          <div className="space-y-2">
            <Label>Role applying for</Label>
            <p className="rounded-md border border-border bg-bg-card px-3 py-2 text-sm text-foreground">
              {jobTitle}
            </p>
          </div>
        )
      )}

      <div className="space-y-2">
        <Label htmlFor="ap-department">Department</Label>
        <select
          id="ap-department"
          className={selectClass}
          {...register("department")}
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
        <Label htmlFor="ap-resume">
          Resume (PDF) <span className="text-destructive">*</span>
        </Label>
        <label
          htmlFor="ap-resume"
          className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border bg-bg-card px-3 py-3 text-sm text-muted-foreground transition-colors hover:border-accent"
        >
          <Upload className="h-4 w-4" />
          <span className="truncate">
            {resume ? resume.name : "Choose a PDF file (max 5MB)"}
          </span>
        </label>
        <input
          id="ap-resume"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setResume(file);
            validateResume(file);
          }}
          aria-invalid={!!resumeError}
        />
        <FieldError message={resumeError ?? undefined} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ap-cover">Cover note</Label>
        <Textarea
          id="ap-cover"
          rows={4}
          {...register("coverNote")}
          placeholder="Tell us why you're a great fit (optional)…"
        />
        <FieldError message={errors.coverNote?.message} />
      </div>

      <Button
        type="submit"
        variant="accent"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  );
}
