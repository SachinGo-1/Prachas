"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { cn } from "@/lib/utils";

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  industries: string[];
  displayOrder: number;
};

export function ServicesManager({ services }: { services: AdminService[] }) {
  const [openSlug, setOpenSlug] = React.useState<string | null>(
    services[0]?.slug ?? null
  );

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <ServiceEditor
          key={service.id}
          service={service}
          open={openSlug === service.slug}
          onToggle={() =>
            setOpenSlug((s) => (s === service.slug ? null : service.slug))
          }
        />
      ))}
    </div>
  );
}

function ServiceEditor({
  service,
  open,
  onToggle,
}: {
  service: AdminService;
  open: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [title, setTitle] = React.useState(service.title);
  const [shortDesc, setShortDesc] = React.useState(service.shortDesc);
  const [longDesc, setLongDesc] = React.useState(service.longDesc);
  const [benefits, setBenefits] = React.useState<string[]>(
    service.benefits.length ? service.benefits : [""]
  );
  const [industries, setIndustries] = React.useState(
    service.industries.join(", ")
  );
  const [displayOrder, setDisplayOrder] = React.useState(service.displayOrder);

  const updateBenefit = (i: number, value: string) =>
    setBenefits((prev) => prev.map((b, idx) => (idx === i ? value : b)));
  const addBenefit = () => setBenefits((prev) => [...prev, ""]);
  const removeBenefit = (i: number) =>
    setBenefits((prev) => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${service.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          shortDesc,
          longDesc,
          benefits: benefits.map((b) => b.trim()).filter(Boolean),
          industries: industries
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
          displayOrder,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast({ variant: "success", title: `Saved “${title}”` });
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not save service",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-bg-card">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {String(service.displayOrder + 1).padStart(2, "0")}
          </span>
          <span className="font-display font-semibold text-foreground">
            {service.title}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-border p-5">
          <div className="space-y-2">
            <Label htmlFor={`title-${service.slug}`}>Title</Label>
            <Input
              id={`title-${service.slug}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`short-${service.slug}`}>Short description</Label>
            <Textarea
              id={`short-${service.slug}`}
              rows={2}
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Long description (markdown)</Label>
            <MarkdownEditor value={longDesc} onChange={setLongDesc} />
          </div>

          <div className="space-y-2">
            <Label>Benefits</Label>
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={b}
                    onChange={(e) => updateBenefit(i, e.target.value)}
                    placeholder="Benefit"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(i)}
                    aria-label="Remove benefit"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
              <Plus className="h-4 w-4" />
              Add benefit
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`ind-${service.slug}`}>
                Industries (comma-separated)
              </Label>
              <Input
                id={`ind-${service.slug}`}
                value={industries}
                onChange={(e) => setIndustries(e.target.value)}
                placeholder="Technology, Healthcare, Finance"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`order-${service.slug}`}>Display order</Label>
              <Input
                id={`order-${service.slug}`}
                type="number"
                min={0}
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="accent" onClick={save} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
