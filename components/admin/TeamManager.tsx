"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";
import { FieldError } from "@/components/public/FieldError";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  displayOrder: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TeamManager({ members }: { members: TeamMember[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<TeamMember | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (m: TeamMember) => {
    setEditing(m);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/team/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      toast({ variant: "success", title: "Team member removed" });
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast({ variant: "error", title: "Could not delete member" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {members.length} team member{members.length === 1 ? "" : "s"} · shown
          on the public About page
        </p>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-card p-12 text-center text-muted-foreground">
          No team members yet. Add one to populate the About page.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  {m.photoUrl ? <AvatarImage src={m.photoUrl} alt={m.name} /> : null}
                  <AvatarFallback>{initials(m.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">{m.name}</p>
                  <p className="text-sm text-accent">{m.role}</p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    Order: {m.displayOrder}
                  </p>
                </div>
              </div>
              {m.bio && (
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {m.bio}
                </p>
              )}
              <div className="mt-4 flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${m.name}`}
                  onClick={() => openEdit(m)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${m.name}`}
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(m)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit team member" : "Add team member"}
            </DialogTitle>
            <DialogDescription>
              Changes appear on the public About page.
            </DialogDescription>
          </DialogHeader>
          <TeamMemberForm
            key={editing?.id ?? "new"}
            member={editing}
            onDone={() => {
              setFormOpen(false);
              setEditing(null);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove team member?</DialogTitle>
            <DialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.name}
              </span>{" "}
              from the About page. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamMemberForm({
  member,
  onDone,
}: {
  member?: TeamMember | null;
  onDone: () => void;
}) {
  const { toast } = useToast();
  const [photoUrl, setPhotoUrl] = React.useState(member?.photoUrl ?? "");
  const [uploading, setUploading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberInput>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name ?? "",
      role: member?.role ?? "",
      bio: member?.bio ?? "",
      displayOrder: member?.displayOrder ?? 0,
    },
  });

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setPhotoUrl(data.url);
      toast({ variant: "success", title: "Photo uploaded" });
    } catch (err) {
      toast({
        variant: "error",
        title: "Upload failed",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: TeamMemberInput) => {
    try {
      const payload = { ...values, photoUrl };
      const res = await fetch(
        member ? `/api/admin/team/${member.id}` : "/api/admin/team",
        {
          method: member ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast({
        variant: "success",
        title: member ? "Member updated" : "Member added",
      });
      onDone();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not save member",
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
          <AvatarFallback>
            <Upload className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
        <div>
          <Label htmlFor="tm-photo" className="cursor-pointer">
            <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-secondary">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {photoUrl ? "Change photo" : "Upload photo"}
            </span>
          </Label>
          <input
            id="tm-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadPhoto(file);
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tm-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input id="tm-name" {...register("name")} aria-invalid={!!errors.name} />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tm-role">
            Role <span className="text-destructive">*</span>
          </Label>
          <Input id="tm-role" {...register("role")} aria-invalid={!!errors.role} />
          <FieldError message={errors.role?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tm-order">Display order</Label>
        <Input
          id="tm-order"
          type="number"
          min={0}
          {...register("displayOrder")}
        />
        <FieldError message={errors.displayOrder?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tm-bio">Short bio</Label>
        <Textarea id="tm-bio" rows={3} {...register("bio")} />
        <FieldError message={errors.bio?.message} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : member ? (
            "Save changes"
          ) : (
            "Add member"
          )}
        </Button>
      </div>
    </form>
  );
}
