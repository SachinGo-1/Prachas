"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ApplyForm } from "@/components/public/ApplyForm";
import { type JobCardData } from "@/components/public/JobCard";

export function ApplicationModal({
  job,
  open,
  onClose,
}: {
  job: JobCardData | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {job && (
          <>
            <DialogHeader>
              <DialogTitle>Apply — {job.title}</DialogTitle>
              <DialogDescription>
                {job.department} · {job.location}
              </DialogDescription>
            </DialogHeader>
            <ApplyForm
              jobId={job.id}
              jobTitle={job.title}
              department={job.department}
              onSuccess={onClose}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
