"use client";

import * as React from "react";
import { Filter, Loader2, Mail, Archive, X, MailOpen } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { SERVICE_INTEREST_OPTIONS } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  serviceInterest: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
};

export function InquiriesManager() {
  const { toast } = useToast();
  const [inquiries, setInquiries] = React.useState<Inquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [detail, setDetail] = React.useState<Inquiry | null>(null);
  const [filters, setFilters] = React.useState({
    serviceInterest: "",
    status: "",
    from: "",
    to: "",
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.serviceInterest)
        params.set("serviceInterest", filters.serviceInterest);
      if (filters.status) params.set("status", filters.status);
      if (filters.from) params.set("from", filters.from);
      if (filters.to) params.set("to", filters.to);
      const res = await fetch(`/api/admin/inquiries?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setInquiries(data.inquiries);
    } catch {
      toast({ variant: "error", title: "Could not load inquiries" });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  React.useEffect(() => {
    load();
  }, [load]);

  const patch = async (id: string, body: Partial<Inquiry>) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      await load();
    } catch {
      toast({ variant: "error", title: "Could not update inquiry" });
    }
  };

  const openDetail = (inq: Inquiry) => {
    setDetail(inq);
    if (!inq.isRead) {
      patch(inq.id, { isRead: true });
    }
  };

  const hasFilters =
    filters.serviceInterest || filters.status || filters.from || filters.to;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="h-4 w-4" />
          Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select
            aria-label="Filter by service interest"
            value={filters.serviceInterest}
            onChange={(e) =>
              setFilters((f) => ({ ...f, serviceInterest: e.target.value }))
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">All services</option>
            {SERVICE_INTEREST_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Inbox (all)</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="archived">Archived</option>
          </select>
          <input
            type="date"
            aria-label="From date"
            value={filters.from}
            onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <input
            type="date"
            aria-label="To date"
            value={filters.to}
            onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({ serviceInterest: "", status: "", from: "", to: "" })
              }
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
      </p>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>From</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden sm:table-cell">Service</TableHead>
              <TableHead className="hidden lg:table-cell">Received</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : inquiries.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center text-muted-foreground">
                  No inquiries match your filters.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inq) => (
                <TableRow
                  key={inq.id}
                  className="cursor-pointer"
                  onClick={() => openDetail(inq)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!inq.isRead && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-accent"
                          aria-label="Unread"
                        />
                      )}
                      <div>
                        <div
                          className={
                            inq.isRead
                              ? "text-foreground"
                              : "font-semibold text-foreground"
                          }
                        >
                          {inq.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {inq.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {inq.company || "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{inq.serviceInterest}</Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {formatDateTime(inq.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {inq.isArchived ? (
                      <Badge variant="muted">Archived</Badge>
                    ) : inq.isRead ? (
                      <Badge variant="muted">Read</Badge>
                    ) : (
                      <Badge variant="warning">Unread</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="max-w-lg">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle>{detail.name}</DialogTitle>
                <DialogDescription>
                  {detail.company ? `${detail.company} · ` : ""}
                  {detail.serviceInterest} · {formatDateTime(detail.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-1 text-sm">
                <a
                  href={`mailto:${detail.email}`}
                  className="text-accent underline-offset-4 hover:underline"
                >
                  {detail.email}
                </a>
              </div>

              <div className="whitespace-pre-wrap rounded-md bg-secondary p-4 text-sm text-foreground">
                {detail.message}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <a
                    href={`mailto:${detail.email}?subject=${encodeURIComponent(
                      `Re: ${detail.serviceInterest} inquiry`
                    )}`}
                  >
                    <Mail className="h-4 w-4" />
                    Reply
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    patch(detail.id, { isRead: !detail.isRead });
                    setDetail({ ...detail, isRead: !detail.isRead });
                  }}
                >
                  <MailOpen className="h-4 w-4" />
                  Mark {detail.isRead ? "unread" : "read"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    patch(detail.id, { isArchived: !detail.isArchived });
                    setDetail(null);
                  }}
                >
                  <Archive className="h-4 w-4" />
                  {detail.isArchived ? "Unarchive" : "Archive"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
