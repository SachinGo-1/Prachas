import { MapPin, Building2, CalendarDays, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export type JobCardData = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salaryRange: string | null;
  description: string;
  requirements: string;
  createdAt: string;
};

function truncate(text: string, max = 120) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

export function JobCard({
  job,
  onApply,
}: {
  job: JobCardData;
  onApply: (job: JobCardData) => void;
}) {
  return (
    <li className="rounded-xl border border-border bg-bg-card p-6 transition-all hover:border-accent/40 hover:shadow-glow">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {job.title}
            </h3>
            <Badge variant="accent" className="capitalize">
              {job.type}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-accent" />
              {job.department}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="inline-flex items-center gap-1.5">
                <Wallet className="h-4 w-4 text-accent" />
                {job.salaryRange}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-accent" />
              Posted {formatDate(job.createdAt)}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {truncate(job.description, 120)}
          </p>
        </div>
        <Button
          variant="accent"
          className="shrink-0"
          onClick={() => onApply(job)}
        >
          Apply Now
        </Button>
      </div>
    </li>
  );
}
