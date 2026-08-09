-- A post now has many categories. The join table is populated from the old
-- BlogPost.category column *before* that column is dropped, so existing
-- posts keep their category instead of being silently reset.

-- CreateTable
CREATE TABLE "_BlogPostToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_BlogPostToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "BlogPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogPostToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Back-fill: a post may name a category that has no row of its own (older
-- data, or an import), so create those first.
INSERT INTO "Category" ("id", "name", "displayOrder", "createdAt")
SELECT lower(hex(randomblob(12))), d."category", 0, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "category" FROM "BlogPost"
      WHERE "category" IS NOT NULL AND trim("category") <> '') AS d
WHERE NOT EXISTS (SELECT 1 FROM "Category" c WHERE c."name" = d."category");

-- Back-fill: link every post to the category it already had.
INSERT INTO "_BlogPostToCategory" ("A", "B")
SELECT b."id", c."id"
FROM "BlogPost" b
JOIN "Category" c ON c."name" = b."category";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BlogPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "coverImage" TEXT,
    "author" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publishedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_BlogPost" ("author", "body", "coverImage", "createdAt", "excerpt", "id", "publishedAt", "slug", "status", "tags", "title", "updatedAt") SELECT "author", "body", "coverImage", "createdAt", "excerpt", "id", "publishedAt", "slug", "status", "tags", "title", "updatedAt" FROM "BlogPost";
DROP TABLE "BlogPost";
ALTER TABLE "new_BlogPost" RENAME TO "BlogPost";
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_BlogPostToCategory_AB_unique" ON "_BlogPostToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogPostToCategory_B_index" ON "_BlogPostToCategory"("B");
