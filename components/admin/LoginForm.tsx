"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/public/FieldError";

type FormValues = { email: string; password: string };

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    setAuthError(null);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      setAuthError("Invalid email or password.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {authError && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          {authError}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email", { required: "Email is required" })}
          aria-invalid={!!errors.email}
          placeholder="admin@prachas.com"
        />
        <FieldError message={errors.email?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password", { required: "Password is required" })}
          aria-invalid={!!errors.password}
          placeholder="••••••••"
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in…
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" />
            Sign In
          </>
        )}
      </Button>

      <p className="rounded-md border border-border bg-secondary px-3 py-2 text-center text-xs text-muted-foreground">
        Demo credentials:{" "}
        <span className="font-mono text-accent">admin@prachas.com</span> /{" "}
        <span className="font-mono text-accent">Prachas@2024</span>
      </p>
    </form>
  );
}
