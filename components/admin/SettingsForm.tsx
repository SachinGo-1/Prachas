"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Loader2, Save, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { FieldError } from "@/components/public/FieldError";
import type { SettingsMap } from "@/lib/settings";

export function SettingsForm({ initial }: { initial: SettingsMap }) {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsMap>({ defaultValues: initial });

  const onSubmit = async (values: SettingsMap) => {
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      toast({ variant: "success", title: "Settings saved" });
    } catch {
      toast({ variant: "error", title: "Could not save settings" });
    }
  };

  const fields: { key: keyof SettingsMap; label: string; type?: string }[] = [
    { key: "companyPhone", label: "Phone" },
    { key: "companyEmail", label: "Email", type: "email" },
    { key: "companyAddress", label: "Address" },
    { key: "linkedinUrl", label: "LinkedIn URL", type: "url" },
    { key: "twitterUrl", label: "Twitter / X URL", type: "url" },
    { key: "businessHoursIST", label: "Business hours (IST)" },
    { key: "businessHoursEST", label: "Business hours (EST)" },
    { key: "notificationEmail", label: "Notification email", type: "email" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className="space-y-2">
            <Label htmlFor={`s-${f.key}`}>{f.label}</Label>
            <Input
              id={`s-${f.key}`}
              type={f.type ?? "text"}
              {...register(f.key)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

type PasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function ChangePasswordForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordValues>();

  const onSubmit = async (values: PasswordValues) => {
    if (values.newPassword !== values.confirmPassword) {
      setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Failed to change password");
      }
      toast({ variant: "success", title: "Password updated" });
      reset();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not change password",
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cp-current">Current password</Label>
        <Input
          id="cp-current"
          type="password"
          autoComplete="current-password"
          {...register("currentPassword", { required: "Required" })}
        />
        <FieldError message={errors.currentPassword?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cp-new">New password</Label>
          <Input
            id="cp-new"
            type="password"
            autoComplete="new-password"
            {...register("newPassword", {
              required: "Required",
              minLength: { value: 8, message: "At least 8 characters" },
            })}
          />
          <FieldError message={errors.newPassword?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cp-confirm">Confirm new password</Label>
          <Input
            id="cp-confirm"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword", { required: "Required" })}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" variant="outline" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" />
          )}
          Update password
        </Button>
      </div>
    </form>
  );
}
