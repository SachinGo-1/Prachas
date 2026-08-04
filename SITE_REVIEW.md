# Prachas Site Review — Codebase vs. Build-Prompt Spec

**Date:** 2026-07-27
**Reviewed:** `main` @ `3569f79` (Next.js 14 App Router + Prisma/SQLite + NextAuth)
**Spec:** `PROJECT_BUILD_PROMPT.md` (corporate marketing site + blog CMS + admin portal)

> **Scope note:** the live site (https://prachas.com/) could not be fetched from this review environment (outbound requests to the domain are blocked by the sandbox network policy), so this is a code-level review of the repository. Everything below is verified against source, not the deployed site.

---

## 1. Summary

The repo is a solid, well-built marketing site + admin portal, but it implements a **different, simpler architecture** than the build-prompt spec and is missing several entire subsystems the spec calls for (search, chatbot, audit log, analytics, trash/restore, user management). More urgently, a handful of **production-readiness issues** exist independent of the spec — broken `metadataBase`, zero SEO plumbing (no robots.txt/sitemap), no security headers, no spam defense on public forms, and résumé PII stored in a world-readable folder.

**What's genuinely good:** clean TypeScript throughout, consistent admin module pattern, every one of the 18 admin API files gated by `requireAdmin`, Zod validation with field-level errors, email that degrades gracefully and never blocks submissions, skip link + `prefers-reduced-motion` + visible focus rings, CSS-keyframe hero animation (matches spec §12), and markdown rendered via `react-markdown` without `rehype-raw` — so blog content is XSS-safe by construction.

---

## 2. Critical issues (fix before/regardless of spec alignment) — P0

| # | Issue | Where | Detail |
|---|---|---|---|
| 1 | `metadataBase` hardcoded to localhost | `app/layout.tsx:29` | `new URL("http://localhost:3000")` — every OG/Twitter URL resolves to localhost in production. Should come from an env var (e.g. `NEXT_PUBLIC_SITE_URL=https://prachas.com`). |
| 2 | No `robots.txt` / `robots.ts` at all | — | Nothing tells crawlers to stay out of `/admin` and `/api`, and nothing addresses the spec's AI-crawler policy (§4). The admin login page even exports `metadata`, so `/admin/login` is indexable today. |
| 3 | No `sitemap.xml` | — | Blog posts and service pages are invisible to crawlers except via internal links. |
| 4 | Résumés (PII) stored in `public/uploads` | `app/api/jobs/[id]/apply/route.ts:81-87`, `join-us/apply` | Anyone with the URL can download a candidate's résumé unauthenticated; the URL is also emailed around in plaintext. Should be a non-public directory served through an authenticated route. Also: on containerized/standalone deploys `public/uploads` is ephemeral — files vanish on redeploy. |
| 5 | Zero spam defense on public forms | `ContactForm`, `ApplyForm`, `ApplicationModal` | Spec §11 requires an always-on honeypot + submission-timing check. Nothing exists — the contact endpoint and both **file-upload** endpoints are fully open to bots. No rate limiting either. |
| 6 | No security headers | `next.config.mjs` | No CSP, HSTS, `X-Frame-Options`, `X-Content-Type-Options`, or `Referrer-Policy` (spec §13). |
| 7 | Default admin credentials committed | `prisma/seed.ts:180-181`, `README.md` | `admin@prachas.com` / `Prachas@2024` are in the repo and README. Fine for dev seeding, but there is no forced rotation and no way to add/deactivate users from the UI — if this seed ran in production, the credentials are public. |
| 8 | `images.remotePatterns` wildcard | `next.config.mjs:5-9` | `hostname: "**"` turns `/_next/image` into an open image proxy for any origin. Restrict to the domains actually used. |

---

## 3. High-value gaps vs. the spec — P1

| Spec § | Requirement | Current state |
|---|---|---|
| §4, §8 | Canonical URL per page | Not set anywhere. |
| §8 | JSON-LD (`Organization`, `WebSite`, `BreadcrumbList`, `Service`, `BlogPosting`) | None. |
| §4 | RSS feed (`/blog/feed.xml`) | None. |
| §4 | `llms.txt` / `llms-full.txt` | None. |
| §12 | ISR over `force-dynamic` | **Every** public page exports `dynamic = "force-dynamic"` (`app/(public)/*/page.tsx`) — the spec calls `revalidate = N` "the single biggest TTFB win available." Home is the only static page; blog/services/about/jobs all hit the DB per-request. |
| §8 | Stats from a single settings-backed source | `STATS` is hardcoded in `lib/constants.ts:149-154`, and the same numbers ("11 years", "98%", "500+") are duplicated in `WHY_PRACHAS`, `TIMELINE`, and page copy — exactly the drift the spec warns about. A `SiteSetting` KV table already exists; stats just aren't in it. |
| §2 | Every mutating admin route wrapped in try/catch returning JSON | Partial. Several mutation routes have **no** try/catch around DB writes (e.g. `app/api/admin/blog/route.ts` POST, `services/route.ts`, `jobs/route.ts`, `team/route.ts`, `settings/route.ts` — their only `catch` is on `req.json()`). A Prisma failure surfaces as an opaque 500, the exact bug class the spec calls out. |
| — | Favicon / OG image | `public/` contains only `uploads/` — no favicon, icon, or default OG image anywhere. |
| — | Blog cover image alt text | `app/(public)/blog/[slug]/page.tsx:74` renders `alt=""` on the post's cover image; should at least fall back to the post title. |

---

## 4. Entire spec subsystems not present — P2 (scope decisions)

These are the big architectural deltas. Each is a deliberate build, not a patch:

1. **Search** (spec §9) — no site search of any kind (no UI, no API, no history table, no per-source admin toggles).
2. **Chatbot** (spec §10) — no assistant, no persona, no RAG, no history table. The spec's core constraint (search and chatbot as two fully independent, swappable stacks) is moot until at least one exists.
3. **Audit log** (spec §7) — no `logAudit()`, no change history on any admin mutation. Currently impossible to answer "who changed what, when."
4. **Trash / soft delete** (spec §5.2) — all deletes (posts, jobs, team, services via CRUD) are permanent.
5. **Analytics / events DB** (spec §3.3) — no page-view tracking, no view counts on posts, no admin analytics page. Inquiries and applications are stored, but there's no unified `form_type`-tagged submissions model.
6. **User management** (spec §5.2) — no admin UI to create/deactivate users, no roles beyond a single `"admin"` string, no avatars. One seeded account plus a change-password endpoint is the entire account system.
7. **News & Awards / client logos / case studies / FAQ** (spec §1, §5.2) — content types not present.
8. **Media library** (spec §5.2) — uploads work but there's no browsable library, and no `files` table (uploads aren't tracked in the DB at all).

---

## 5. Architecture deltas (different-by-design, document rather than "fix")

The repo predates the spec and made different stack choices. These work, but diverge from the spec's stated patterns:

| Area | Spec | Repo |
|---|---|---|
| Data | 3 separate SQLite DBs (content / pages / events) via `better-sqlite3`, idempotent self-migrations | 1 Prisma SQLite DB, versioned `prisma migrate` migrations |
| DB ops | Explicit pull/push Azure sync scripts with safety policies | None (single `dev.db`; "switch to Postgres" is the documented prod path) |
| Auth | Custom scrypt + HTTP-only session cookies, email OTP, **sliding** 8h expiry, re-auth modal | NextAuth Credentials + bcrypt, JWT with **fixed** 8h `maxAge`, no OTP, hard redirect on expiry (in-progress form data is lost) |
| Roles | superadmin / admin / editor + `hasPermission()` | Single `admin` role, no permission checks beyond "logged in" |
| Deactivation | First-class `active` flag enforced login-time and per-request | Not possible — `User` has no active flag, and JWT sessions can't be revoked server-side mid-session |
| Content | Rich-text HTML + `sanitizeHtml()` at render **and** publish | Markdown + `react-markdown` (no raw HTML pass-through — safe, and simpler; sanitize-on-publish is unnecessary in this model) |
| Email | SendGrid | Nodemailer/SMTP with console fallback (arguably nicer for dev) |

If the intent is to converge this repo onto the spec, the auth items (sliding session, OTP, deactivation, roles) are the highest-impact deltas because several spec features (audit log actors, user management) depend on them.

---

## 6. What already meets the spec

- **Stack basics** (§2): App Router, strict TypeScript (no `any` found in app code), Tailwind, lucide-react, Server Components by default with `'use client'` only where needed.
- **Admin portal shape** (§5): sidebar shell + one manager module per content type (blog, jobs, applications, inquiries, services, team, settings), consistent list/filter/search/DataTable pattern, loading skeletons, empty states.
- **Admin API auth** (§13): all 18 `app/api/admin/**` route files call `requireAdmin()`; middleware additionally gates `/admin` pages.
- **Forms** (§5.3): React Hook Form + Zod with field-level server error mapping; submit buttons reset in `finally` blocks in the manager components checked.
- **Email resilience**: 8s connect timeouts, never throws into the user-facing response, console fallback when unconfigured — matches the spec's spirit exactly.
- **Accessibility** (§14): skip link (`app/(public)/layout.tsx`), `prefers-reduced-motion` handling in `globals.css`, visible focus rings, ARIA labels, semantic landmarks.
- **Performance** (§12): hero "scanning line" is a CSS `@keyframes` animation, not a rAF loop; no root-layout image preloads.
- **Titles** (§4): root `title.template` + per-page bare titles — no double-brand-suffix bug. (Home page relies on the root default, which is acceptable.)

---

## 7. Recommended sequencing

1. **P0 hotfix pass (small, ~1 day):** env-driven `metadataBase`; add `robots.ts` (disallow `/admin`, `/api`, with per-bot-group AI-crawler entries per spec §4) + `sitemap.ts`; security headers in `next.config.mjs`; restrict `remotePatterns`; honeypot + timing check on all three public forms; favicon/OG image.
2. **P0 structural (needs a deploy decision):** move résumé storage out of `public/` behind an authenticated download route; decide on persistent storage for uploads; rotate/remove seeded admin credentials in prod.
3. **P1 SEO/perf pass:** canonicals, JSON-LD, RSS, `revalidate` instead of `force-dynamic` on public pages, stats into `SiteSetting`, try/catch on the remaining mutation routes.
4. **P2 roadmap:** decide which spec subsystems are actually wanted for Prachas (audit log and trash are cheap wins on the existing Prisma model; search → chatbot in that order if the two-independent-stacks pattern is adopted; user management requires the auth upgrade first).
