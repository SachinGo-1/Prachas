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

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export function ApplyForm({
  jobId,
  jobTitle,
  onSuccess,
}: {
  jobId: string;
  jobTitle: string;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [resume, setResume] = React.useState<File | null>(null);
  const [resumeError, setResumeError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { jobId, name: "", email: "", phone: "", coverNote: "" },
  });

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

    try {
      const fd = new FormData();
      fd.append("jobId", jobId);
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("phone", values.phone);
      fd.append("coverNote", values.coverNote || "");
      fd.append("resume", resume as File);

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      toast({
        variant: "success",
        title: "Application submitted",
        description: `Thanks for applying to ${jobTitle}. We'll be in touch.`,
      });
      onSuccess();
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
            placeholder="+1 555 123 4567"
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ap-resume">
          Resume (PDF) <span className="text-destructive">*</span>
        </Label>
        <label
          htmlFor="ap-resume"
          className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-input bg-background px-3 py-3 text-sm text-brand-muted transition-colors hover:border-brand-saffron/50"
        >
          <Upload className="h-4 w-4" />
          <span className="truncate">
            {resume ? resume.name : "Choose a PDF file (max 5MB)"}
          </span>
        </label>
        <input
          id="ap-resume"
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
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
