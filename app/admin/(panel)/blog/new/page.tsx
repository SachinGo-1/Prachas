import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogForm } from "@/components/admin/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-dim"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to posts
        </Link>
        <h1 className="mt-3 font-display text-2xl font-bold text-foreground">
          New Post
        </h1>
      </div>
      <BlogForm />
    </div>
  );
}
