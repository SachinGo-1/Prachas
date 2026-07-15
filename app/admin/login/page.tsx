import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/public/Logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-12">
      <div className="absolute inset-0 dot-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
        aria-hidden
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo variant="stacked" />
        </div>
        <div className="rounded-2xl border border-border border-t-2 border-t-accent bg-bg-card p-8 shadow-glow">
          <h1 className="text-center font-display text-2xl font-bold text-foreground">
            Admin Portal
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in to manage content, jobs, applications, and inquiries.
          </p>
          <div className="mt-8">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
