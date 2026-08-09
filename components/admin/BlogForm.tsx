"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { blogSchema, type BlogInput } from "@/lib/validations";
import { slugify, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/public/FieldError";
import { useToast } from "@/components/ui/toast";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const EXCERPT_HINT = 150;

export type CategoryOption = { id: string; name: string };

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  categories: string[];
  excerpt: string;
  body: string;
  coverImage: string | null;
  author: string;
  tags: string;
  status: string;
};

export function BlogForm({
  post,
  categories,
}: {
  post?: BlogRecord | null;
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const { toast } = useToast();

  // Held in state so a category added inline shows up immediately. A post
  // may carry a category with no row of its own (an import), so keep it
  // listed rather than dropping it silently on save.
  const [options, setOptions] = React.useState<CategoryOption[]>(() => {
    const all = [...categories];
    for (const name of post?.categories ?? []) {
      if (!all.some((c) => c.name === name)) all.unshift({ id: `orphan:${name}`, name });
    }
    return all;
  });
  const [addingCategory, setAddingCategory] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState("");
  const [categoryError, setCategoryError] = React.useState<string | null>(null);
  const [savingCategory, setSavingCategory] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const [coverImage, setCoverImage] = React.useState(post?.coverImage ?? "");
  const [uploading, setUploading] = React.useState(false);
  // On edit, treat the slug as user-owned so a title tweak won't clobber it.
  const [slugEdited, setSlugEdited] = React.useState(!!post);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      categories: post?.categories ?? [],
      excerpt: post?.excerpt ?? "",
      body: post?.body ?? "",
      coverImage: post?.coverImage ?? "",
      author: post?.author ?? "",
      tags: post?.tags ?? "",
      status: (post?.status as BlogInput["status"]) ?? "draft",
    },
  });

  const titleReg = register("title");
  const slugReg = register("slug");
  const body = watch("body") ?? "";
  const selected = watch("categories") ?? [];
  const excerptLen = (watch("excerpt") ?? "").length;

  const toggleCategory = (name: string) => {
    const next = selected.includes(name)
      ? selected.filter((c) => c !== name)
      : [...selected, name];
    setValue("categories", next, { shouldValidate: true });
  };

  const addCategory = async () => {
    const name = newCategory.trim();
    if (name.length < 2) {
      setCategoryError("Enter a category name.");
      return;
    }
    if (options.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setCategoryError("That category already exists.");
      return;
    }

    setSavingCategory(true);
    setCategoryError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add category");

      setOptions((prev) => [...prev, { id: data.category.id, name }]);
      setValue("categories", [...selected, name], { shouldValidate: true });
      setNewCategory("");
      setAddingCategory(false);
      toast({ variant: "success", title: `Added “${name}”` });
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Could not add category"
      );
    } finally {
      setSavingCategory(false);
    }
  };

  const deleteCategory = async (cat: CategoryOption) => {
    setDeletingId(cat.id);
    setCategoryError(null);
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete category");

      setOptions((prev) => prev.filter((c) => c.id !== cat.id));
      setValue(
        "categories",
        selected.filter((c) => c !== cat.name),
        { shouldValidate: true }
      );
      toast({ variant: "success", title: `Deleted “${cat.name}”` });
    } catch (err) {
      // Not setCategoryError: that only renders inside the add-category
      // panel, which is closed during a delete, so it would fail silently.
      toast({
        variant: "error",
        title: "Could not delete category",
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCoverImage(data.url);
      setValue("coverImage", data.url, { shouldValidate: true });
      toast({ variant: "success", title: "Cover image uploaded" });
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

  const removeCover = () => {
    setCoverImage("");
    setValue("coverImage", "", { shouldValidate: true });
  };

  const onSubmit = async (values: BlogInput) => {
    try {
      const res = await fetch(
        post ? `/api/admin/blog/${post.id}` : "/api/admin/blog",
        {
          method: post ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (res.status === 409) {
        setError("slug", { message: "That slug is already in use" });
        toast({
          variant: "error",
          title: "Slug already in use",
          description: "Choose a different slug and try again.",
        });
        return;
      }
      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to save");
      }

      toast({
        variant: "success",
        title: post ? "Post updated" : "Post created",
      });
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      toast({
        variant: "error",
        title: "Could not save post",
        description: err instanceof Error ? err.message : undefined,
      });
    }
  };

  // Set the status field, then submit through validation.
  const submitAs = (status: BlogInput["status"]) => {
    setValue("status", status);
    return handleSubmit(onSubmit)();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="bf-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bf-title"
              {...titleReg}
              onChange={(e) => {
                titleReg.onChange(e);
                if (!slugEdited) {
                  setValue("slug", slugify(e.target.value), {
                    shouldValidate: true,
                  });
                }
              }}
              aria-invalid={!!errors.title}
            />
            <FieldError message={errors.title?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bf-slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bf-slug"
              {...slugReg}
              onChange={(e) => {
                slugReg.onChange(e);
                setSlugEdited(true);
              }}
              aria-invalid={!!errors.slug}
            />
            <p className="text-xs text-muted-foreground">
              Used in the post URL: /blog/{watch("slug") || "your-slug"}
            </p>
            <FieldError message={errors.slug?.message} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="bf-excerpt">
                Excerpt <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "font-mono text-xs",
                  excerptLen > EXCERPT_HINT
                    ? "text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {excerptLen}/{EXCERPT_HINT}
              </span>
            </div>
            <Textarea
              id="bf-excerpt"
              rows={3}
              {...register("excerpt")}
              aria-invalid={!!errors.excerpt}
            />
            <FieldError message={errors.excerpt?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bf-body">
              Body <span className="text-destructive">*</span>
            </Label>
            <MarkdownEditor
              value={body}
              onChange={(v) => setValue("body", v, { shouldValidate: true })}
            />
            <FieldError message={errors.body?.message} />
          </div>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-sm font-medium leading-none">
              Categories <span className="text-destructive">*</span>
            </span>

            {/* Selected, each removable */}
            {selected.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 pt-1">
                {selected.map((name) => (
                  <li key={name}>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent py-1 pl-3 pr-1 text-xs font-medium text-accent-foreground">
                      {name}
                      <button
                        type="button"
                        onClick={() => toggleCategory(name)}
                        aria-label={`Remove ${name}`}
                        className="rounded-full p-0.5 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* Full list — tick to apply, trash to delete outright */}
            <ul
              className="max-h-56 space-y-0.5 overflow-y-auto rounded-md border border-border p-1"
              aria-label="Categories"
            >
              {options.length === 0 && (
                <li className="px-2 py-3 text-center text-xs text-muted-foreground">
                  No categories yet — add one below.
                </li>
              )}
              {options.map((c) => {
                const checked = selected.includes(c.name);
                return (
                  <li key={c.id} className="flex items-center gap-1">
                    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-bg-raised">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(c.name)}
                        className="h-4 w-4 rounded border-border accent-accent"
                      />
                      <span className="truncate">{c.name}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => void deleteCategory(c)}
                      disabled={deletingId === c.id}
                      aria-label={`Delete category ${c.name}`}
                      title={`Delete “${c.name}” everywhere`}
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-bg-raised hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                      {deletingId === c.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <FieldError message={errors.categories?.message} />
            {!addingCategory && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setCategoryError(null);
                  setAddingCategory(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add category
              </Button>
            )}

            {addingCategory && (
              <div className="rounded-md border border-border bg-bg-raised p-3">
                <Label htmlFor="bf-new-category" className="text-xs">
                  New category
                </Label>
                <Input
                  id="bf-new-category"
                  autoFocus
                  className="mt-1.5"
                  placeholder="e.g. Case Studies"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    setCategoryError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // The category field lives inside the post form; let
                      // Enter add the category, not submit the post.
                      e.preventDefault();
                      void addCategory();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      setAddingCategory(false);
                      setNewCategory("");
                      setCategoryError(null);
                    }
                  }}
                />
                <FieldError message={categoryError ?? undefined} />
                <div className="mt-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void addCategory()}
                    disabled={savingCategory}
                  >
                    {savingCategory && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Add
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setAddingCategory(false);
                      setNewCategory("");
                      setCategoryError(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bf-author">
              Author <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bf-author"
              {...register("author")}
              aria-invalid={!!errors.author}
            />
            <FieldError message={errors.author?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bf-tags">Tags</Label>
            <Input
              id="bf-tags"
              placeholder="comma, separated, tags"
              {...register("tags")}
              aria-invalid={!!errors.tags}
            />
            <FieldError message={errors.tags?.message} />
          </div>

          <div className="space-y-2">
            <Label>Cover image</Label>
            {coverImage ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="aspect-[16/9] w-full rounded-md border border-border object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeCover}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <Label htmlFor="bf-cover" className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Upload image
                  </span>
                </Label>
                <input
                  id="bf-cover"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadCover(file);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-6">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting || uploading}
          onClick={() => submitAs("draft")}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Draft"
          )}
        </Button>
        <Button
          type="button"
          variant="accent"
          disabled={isSubmitting || uploading}
          onClick={() => submitAs("published")}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
        </Button>
      </div>
    </form>
  );
}
