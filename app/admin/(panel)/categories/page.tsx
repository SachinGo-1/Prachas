import { prisma } from "@/lib/prisma";
import {
  CategoriesManager,
  type Category,
} from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [rows, grouped] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    }),
    prisma.blogPost.groupBy({ by: ["category"], _count: { _all: true } }),
  ]);

  const counts = new Map(grouped.map((g) => [g.category, g._count._all]));
  const categories: Category[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    displayOrder: c.displayOrder,
    postCount: counts.get(c.name) ?? 0,
  }));

  return <CategoriesManager categories={categories} />;
}
