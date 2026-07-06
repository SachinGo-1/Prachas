"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin] boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-xl border bg-card p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h2 className="mt-5 text-xl font-semibold text-brand-ink">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        An unexpected error occurred while loading this page. You can try again,
        and if the problem persists, check the server logs.
      </p>
      <Button onClick={reset} className="mt-6">
        <RotateCw className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
