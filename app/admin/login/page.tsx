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
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4 py-12">
      <div className="absolute inset-0 grid-pulse-bg opacity-40" aria-hidden />
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo variant="light" />
        </div>
        <div className="rounded-2xl border bg-card p-8 shadow-xl">
          <h1 className="text-center text-2xl font-bold text-brand-ink">
            Admin Portal
          </h1>
          <p className="mt-2 text-center text-sm text-brand-muted">
            Sign in to manage jobs, applications, and inquiries.
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
