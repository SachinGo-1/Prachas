"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { blogSchema, type BlogInput } from "@/lib/validations";
import { BLOG_CATEGORIES } from "@/lib/constants";
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

export type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  author: string;
  tags: string;
  status: string;
};

export function BlogForm({ post }: { post?: BlogRecord | null }) {
  const router = useRouter();
  const { toast } = useToast();

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
      category: (post?.category as BlogInput["category"]) ?? BLOG_CATEGORIES[0],
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
  const excerptLen = (watch("excerpt") ?? "").length;

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
            <Label htmlFor="bf-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <select
              id="bf-category"
              className={selectClass}
              {...register("category")}
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError message={errors.category?.message} />
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
