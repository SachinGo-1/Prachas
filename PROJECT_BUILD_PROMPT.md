# Build Prompt: Corporate Marketing Site + Blog CMS + Admin Portal

> Paste this document into a fresh Claude Code / AI coding session as the starting brief for a new project. It specifies the full architecture, feature set, and engineering standards of a production Next.js marketing site with an embedded content-management admin portal, built and hardened over an extended real-world engineering engagement. Replace brand-specific names (company name, contract names, colors) with the new project's details; keep the architecture and patterns.

---

## 1. What to build

A **Next.js (App Router) marketing website** for a B2B/government-facing services company, with:
- A public-facing site: home, service pages, contract/product pages, about, contact, careers, case studies, FAQ
- A **blog** with full CMS authoring (not a headless-CMS SaaS — a custom-built admin portal)
- An **admin portal** (`/admin/*`) for non-technical staff to manage all site content without touching code
- A **site-wide AI chatbot assistant** with a persona, and **site search** — built as two independently swappable subsystems
- Full **SEO**, **ADA/WCAG 2.1 AA accessibility**, and **audit-trail** compliance baked in from the start, not bolted on

---

## 2. Tech stack & standards

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js App Router, Turbopack | Server Components by default; `'use client'` only where interactivity is required |
| Language | TypeScript | Strict; no `any` in new code |
| Styling | Tailwind CSS | Utility classes; a small number of global CSS rules for rich-text ("prose") typography |
| Data | **SQLite via `better-sqlite3`**, not a hosted DB | Three separate `.db` files (see §3) — synchronous, zero-latency, trivially backed up as flat files |
| Persistence | **Azure File Share**, mounted into the container at runtime | The SQLite files live on the mount; the app reads/writes them directly. No separate database server to run |
| Deployment | Docker multi-stage build + Azure DevOps pipeline | Standalone Next.js output |
| Auth | Custom session-cookie auth (no third-party auth SaaS) | scrypt password hashing, HTTP-only session cookies, sliding-expiry sessions |
| Email | SendGrid | Contact form notifications, OTP codes, lead-form notifications |
| AI | Gemini (or equivalent) via direct HTTP call from an API route | No SDK dependency; system-prompt-driven persona |
| Icons | lucide-react | |

**Code style rules to carry over:**
- No comments except where a non-obvious constraint/workaround needs explaining (why, not what)
- Don't add abstractions, config flags, or "future-proofing" beyond what's asked
- Every mutating admin API route is wrapped in try/catch and returns a JSON error (never lets an unhandled exception surface as an opaque 500/HTML page — this was a real production bug class: silent client-side failures because a route threw HTML instead of JSON)
- Every new DB table/column is added via an **idempotent migration** (`CREATE TABLE IF NOT EXISTS`, checked-then-`ALTER TABLE ADD COLUMN`) that runs automatically the first time the module is imported in a given process — there is no separate "run migrations" step or migration-numbering system
- **Golden operational rule:** local SQLite files and the Azure copies are reconciled via *deliberate, explicit* pull/push scripts — **never automatically, never as a side effect of a build.** (See §4 for why this matters and what went wrong when it wasn't followed.)

---

## 3. Data architecture — three independent SQLite databases

Do **not** put everything in one database. Split by *who owns the data and how fast it changes*:

### 3.1 Blog / CMS database (`data/blog/data.db`)
The primary content store. Tables:
- `articles` — blog posts (title, slug, content HTML, excerpt, category, tags JSON, status: draft/published/archived/scheduled, `author` display-name text field, `author_user_id` FK to `cms_users.id`, `published_at`, `view_count`, meta title/description)
- `categories` — blog categories with post counts
- `cms_users` — admin accounts (id, email, name, password_hash, salt, role, avatar, **active** boolean, timestamps, last_login)
- `cms_sessions` — session tokens with sliding expiry
- `cms_password_resets` — password reset tokens
- `cms_settings` — generic key/value store for runtime-editable site config (stat numbers shown on the homepage, banner text, feature toggles — see §8)
- `cms_trash` — soft-delete holding table (JSON snapshot of the deleted row + type + who deleted it + when); posts and media go here before permanent deletion, with restore capability
- `news_items` — a generic "News & Awards" content type (contract win announcements, certifications, press) with category, status, sort order, social-auto-post tracking
- `client_logos` — logo carousel entries (name, logo URL, website, display order, active flag)
- `cms_audit_log` — see §7
- `files` — uploaded media library

### 3.2 Pages database (`data/pages/data.db`)
One row per public route, **auto-synced from the filesystem** by a build-time script that walks `src/app/**/page.tsx` and diffs against the DB (inserts new pages with placeholder metadata, marks removed pages archived, never touches manually-curated fields). Powers:
- `sitemap.xml` generation
- `llms.txt` / `llms-full.txt` generation (AI-crawler discovery files — see §8.4)
- Page-level SEO metadata tracking (title, target keyword, traffic tier, owner, notes) that a human can edit later without a code deploy

### 3.3 Events / analytics database (`data/events/data.db`)
Server-generated, append-mostly, **never edited by hand**:
- `page_events` — page views, scroll depth, session duration
- `contact_submissions` — every contact-form / lead-form submission, tagged with a `form_type` column (e.g. "Contact Form", "Free Job Posting", campaign-specific labels) so multiple lead-capture surfaces share one table but stay filterable
- `search_history` — **own table**, own module file, own admin page (see §9)
- `chatbot_history` — **own table**, own module file, own admin page (see §10)

> **Why `search_history` and `chatbot_history` are two separate tables/modules/routes/admin-pages instead of one "query_history" table with a type column:** the business requirement was "we're going to replace the search implementation later — make sure ripping it out never touches the chatbot." A shared table with a `query_type` discriminator makes that impossible to do cleanly. Two fully independent stacks (table → data-access module → API route → admin page) mean deleting search is: delete 4 files, drop 1 table, done — zero risk to the chatbot.

### 3.4 Azure sync scripts — the critical safety pattern
Three scripts, each with a **different, deliberate safety policy**:

```
scripts/sync-azure-dbs.cjs   → PULL only. Compares Azure's last-modified time
                                 against a local stamp file; downloads only if
                                 Azure is newer. Runs automatically on every
                                 `npm run dev` / `npm run build` via pre-hooks.
scripts/upload-blog-db.cjs   → PUSH only. Manual command (`npm run upload:blog-db`).
                                 Shows a confirmation diff before writing.
                                 NEVER runs automatically, NEVER as part of a
                                 build or deploy pipeline.
scripts/sync-pages-db.js     → Local-only. Diffs src/app/**/page.tsx against
                                 pages.db; no network involved.
```

**Real incident this pattern protects against, worth designing around explicitly:** an engineer made direct edits to the local blog DB (new user accounts, reassigned post authors) via a one-off script, bypassing the app's normal write path — so the local "last synced" stamp was never updated. Running `npm run build` shortly after triggered the automatic *pull* pre-hook, which saw Azure's copy was newer (due to an unrelated schema migration bumping its timestamp) and **silently overwrote every uncommitted local change**. Root cause: automatic pulls are safe *only* if every local write path updates the sync stamp, or if pulls check for uncommitted local changes first. **Design decision for the new project: either (a) make the automatic pull refuse to run if the local DB's mtime is newer than the last-recorded pull time, or (b) require an explicit `--force` for auto-pull in any script that a human might run after making manual local DB edits.** At minimum, document loudly that *any* direct DB edit must be followed immediately by an upload, before running dev/build again.

---

## 4. Public site structure & conventions

- Every page exports `metadata` (or `generateMetadata`) with a **unique title** (don't also hardcode the brand suffix in the title string if the root layout already appends it via `title.template` — this caused every page to render as "Page Name | Brand | Brand" in search results)
- `alternates.canonical` set per-page; **never** set at the root layout (it would make Google think every page is a duplicate of the homepage)
- Root layout provides sitewide `Organization` + `WebSite` JSON-LD; individual pages add `BreadcrumbList`, `GovernmentService`/`Service`, `FAQPage`, `BlogPosting`, `VideoObject` as appropriate
- A single reusable `<PageBanner>` component (title + optional background image + breadcrumb) used across all secondary pages
- Contract/product page template component reused across every "product line" page (this project's equivalent: `ContractPageTemplate`) so new offering pages are data, not new layout code
- A `robots.ts` that **explicitly lists every AI crawler** (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, etc.) as `allow: '/'` **plus** `disallow: ['/api/', '/admin/']` on *every single one* — a robots.txt rule only applies to the single most-specific matching user-agent group, so naming AI bots without repeating the disallow list on each of their groups silently un-blocks `/admin` for them
- `llms.txt` and `llms-full.txt` routes, generated from the pages DB + published blog posts, following the llmstxt.org convention (H1 title, blockquote summary, H2 sections of markdown links)
- RSS feed (`/blog/feed.xml`) generated from published posts

---

## 5. Admin portal (`/admin/*`)

### 5.1 Layout & auth
- `AdminShell` component wraps every admin page: sidebar nav (role-gated items), user menu, session-expiry handling
- Session-expiry UX: an 8-hour **sliding** session (each authenticated request pushes expiry forward; a 30-day cookie carries the token so the sliding window — not the cookie — is what actually gates access). A periodic client-side check (every 5 min) plus a global `401` event listener trigger a **re-auth modal** (not a hard redirect) so the user doesn't lose in-progress form data
- Login flow: email + password → **email OTP code** (6 digits, 10-minute expiry, SendGrid) → session created. Same OTP mechanism reused for the re-auth modal
- Role model: `superadmin` / `admin` / `editor`, enforced via a `hasPermission(user, permissionKey)` helper and per-route checks, never trust the client

### 5.2 Modules (one admin page + API route pair each)
- **Posts** — list/filter/search, create/edit (rich text), publish/schedule, trash (soft delete)
- **Categories** — CRUD, with search
- **Media Library** — uploaded files, trash/restore
- **News & Awards** — a generic announcement content type with optional auto-post-to-social on publish
- **Client Logos** — CRUD with drag-reorderable display order
- **Users** — CRUD, role assignment, **avatar** (upload via the existing file-upload endpoint, or pick one of two illustrated default persona images — see §6.3), and **active/inactive toggle** (deactivation blocks login immediately, both at password-login time and on the very next request of an already-open session — without deleting the account or its authorship history)
- **Settings** — a form over the `cms_settings` key/value table: homepage stat numbers, an editable sitewide announcement banner, and **per-source search toggles** (see §9)
- **Search History** / **Chatbot History** — two independent, near-identical admin pages (filters: date range, free-text search; expandable rows showing full visitor context: IP, browser/OS, geo, session)
- **Audit Log** — see §7
- **Contact Submissions** — every lead form, filterable by `form_type`, with attachment support
- **Trash** — unified restore/permanently-delete UI for posts and media
- **Analytics** — page views, top pages, event breakdown from the events DB

### 5.3 Every list page follows the same pattern
Client component, `useMemo`-filtered by a debounced search box, paginated, with a loading skeleton and an explicit empty state. Every create/update form has full try/catch with `finally { setSubmitting(false) }` — a missing `finally` was a real bug (a button stuck on "Adding…" forever when the API returned an unexpected shape).

---

## 6. Blog content pipeline

### 6.1 Sanitization (`sanitizeHtml()`) — runs at **both** render time and publish time
A single shared function, since content may come from a legacy import (WordPress/Strapi) or a rich-text editor:
- Strip `<script>`/`<style>`, inline event handlers, `javascript:` URLs
- Strip legacy CMS block-editor comments (e.g. `<!-- wp:paragraph -->`) — **use a non-greedy match** (`[\s\S]*?`), not a "no hyphen" character class; hyphenated attribute values (`{"className":"is-style-dots"}`) will break a naive regex and leak raw HTML comments onto the live page
- Sanitize inline `style=""` attributes (strip `expression()`, `javascript:`, `position:fixed/absolute`, `display:none` — allow safe visual properties)
- Collapse dead-space paragraphs: empty `<p></p>`, `<p>&nbsp;</p>`, and 2+ consecutive `<br>` — the single biggest source of "ugly empty gaps" complaints in published content
- Force `autoplay muted playsInline controls` onto every `<video>` tag that's missing them (autoplay requires `muted`; never autoplay with sound)
- Wrap bare text nodes between block elements in `<p>` tags (handles content pasted without paragraph markup)

### 6.2 Publish-time audit
Wire `sanitizeHtml()` into the posts create/update API routes: whenever a post's status **is or becomes `published`**, run its content through the sanitizer **before saving**, not just at render time. This matters because RSS, `llms.txt` excerpts, and search indexing all read the raw stored content directly — cleaning only at render time leaves those consumers with the messy version.

### 6.3 Author identity
- `cms_users.avatar` (nullable URL) — set via upload or by picking one of two locally-hosted illustrated default persona images (one male-presenting, one female-presenting; **download these once at build time from a free generative-avatar API and commit them to `/public`** — do not hotlink a third-party avatar service at runtime, for both reliability and CSP simplicity)
- Blog posts link to their author two ways: a proper `author_user_id` FK (set at creation time going forward) **and** a best-effort fallback that matches `articles.author` (free-text display name) against `cms_users.name` — necessary because legacy/imported content has no FK, only a name string
- Never expose `password_hash`/`salt` in any avatar/audit payload — always pass through a `stripSensitive()` projection first

### 6.4 Reading experience
- Client-computed read time (`words / 200 wpm`, minimum 1 minute), shown near the title and in the sticky meta bar
- Auto-generated heading IDs + a table-of-contents sidebar built by regex-scanning `<h2>`/`<h3>` tags
- Comprehensive typography CSS for rich content: heading scale, blockquote treatment, code blocks, tables, WordPress-style figure/caption and alignment classes, responsive iframe/video embeds — build this once, thoroughly, rather than patching it page by page

---

## 7. Audit log (admin change-history — distinct from analytics)

A generic, reusable `logAudit()` call wired into **every** mutating admin route (posts, categories, news, client logos, users, settings, trash restore/delete). Schema:

```
cms_audit_log:
  id, entity_type, entity_id, entity_label,
  action ('create'|'update'|'delete'|'restore'),
  actor_id, actor_name, actor_email,
  old_value (JSON), new_value (JSON),
  reason (free text — auto-summarized diff, e.g. "Updated fields: title, status"),
  source (which admin section made the change),
  created_at
```

- **Who** = actor fields. **When** = timestamp. **How** = `source`. **Why** = auto-generated `reason` (diff old vs. new keys) — no extra UI burden on the editor.
- Never store `passwordHash`/`salt` in a user-entity audit snapshot — strip first.
- One admin page (filters: entity type, action, actor, date range, text search) with expandable rows showing a side-by-side old/new JSON diff.
- Gate the page behind the same permission as user management (this is a sensitive, sitewide oversight view).

---

## 8. SEO

- Metadata coverage on every page (no missing descriptions, no duplicate titles) — audit this explicitly, it drifts as pages are added
- Structured data: `Organization`+`WebSite` sitewide; `BreadcrumbList` on every secondary page; `GovernmentService`/`Service` on offering pages; `FAQPage` where relevant; `BlogPosting` on posts; `VideoObject` where a page centers on a video
- `sitemap.xml` generated from the pages DB, excluding any `noindex` route
- `robots.txt` — see §4 for the per-bot-group gotcha
- `llms.txt`/`llms-full.txt` — generated, not hand-maintained; pull "recent awards"-style dynamic sections from the live content DB, not a hardcoded array, or they go stale silently
- A `cms_settings`-backed set of homepage stat numbers (years in business, clients served, etc.) editable from Settings — **every page that displays a stat must read from this single source**, not a locally hardcoded copy, or numbers drift out of sync across pages (this was a real recurring bug)

---

## 9. Search — one of two independently swappable subsystems

Multi-source, tokenized, keyword search across: site pages, blog posts, "events" (a news sub-category), "awards" (another news sub-category), blog categories, client directory, and the external job board — **each source individually toggle-able from admin Settings** (`search_pages`, `search_blogs`, `search_events`, `search_categories`, `search_awards`, `search_clients`, `search_jobs` boolean flags in `cms_settings`, default-on if unset).

- Candidate retrieval must match against **full content**, not just titles/keywords fields, or pages with only body-text matches never surface
- The results UI must actually render every source the API returns — an API that computes 6 sources but a UI that only displays 2 is a real, easy-to-miss gap
- Any other on-site "answer engine" (a chatbot, a RAG assistant) that reads from the same underlying content must **honor the same admin toggles**, or disabling a source in Settings has no real effect
- Own data-access module, own table, own admin page (see §3.3) — deliberately decoupled from the chatbot so it can be replaced with a different search product later without touching chatbot code

---

## 10. Chatbot — the second independently swappable subsystem

- Floating launcher, persistent across client-side navigation (mount once at the root layout, not per-page)
- **Give it a name and a face**, not just "AI Assistant" — a small illustrated avatar (same locally-hosted-default-image approach as author avatars) makes it feel like a person, not a widget
- **Page-aware greeting**: a lookup table of natural-language greeting variants per route (2+ phrasings per page, chosen at random, so it doesn't feel scripted) — e.g. home gets "How can we help you today?", a product page gets "How can we help you with [Product]?"
- **Auto-launch, done respectfully:**
  - Open automatically ~1.5s after landing on a page the visitor hasn't seen this session (tracked via `sessionStorage`, so it doesn't nag on repeat visits to the same page)
  - Never steal keyboard focus on an automatic open — only focus the input box if the visitor *manually* clicked to open it
  - The instant the visitor sends a real message, stop all auto-greeting logic for the rest of the session — never interrupt an active conversation
- **Conversational tone is a deliberate system-prompt design problem, not an afterthought:** instruct the model explicitly to skip filler ("Great question!"), use contractions, vary sentence openings, not repeat the user's question back, ask a clarifying follow-up instead of guessing, and stay under ~130 words / 2-4 sentences. This is worth iterating on with real example outputs — it reads as robotic by default.
- Lightweight RAG: pull 1-2 relevant page snippets + 1 blog excerpt via the same keyword-matching used by search, inject as context alongside the system prompt and the user's question — no vector DB needed at this content scale
- Own history table, own module, own admin page, independent of search (§3.3, §9)
- Respect the same content-source toggles the admin configured for search, where the chatbot reads from the same underlying sources

---

## 11. Lead-capture forms ("free tools" / campaign landing pages)

A reusable pattern for every lead-gen surface (contact form, "post a job free," "request a demo," gated tools):

- **Spam defense, layered:**
  1. Always-on, zero-config: a honeypot field (visually hidden, `tabIndex={-1}`, `aria-hidden`, never seen by a real visitor) + a submission-timing check (reject if submitted faster than ~1.2s after the form rendered, or older than ~6h — a stale/replayed form)
  2. Optional, stronger: Cloudflare Turnstile — the widget **renders nothing and the form still works** if the site key env var isn't set, so it can be turned on later without a code change
- Every submission both **emails a notification** (SendGrid) and **writes to the events DB** with a `form_type` label, so all lead sources are visible in one admin Contacts view but distinguishable by campaign
- Campaign landing pages on a separate marketing subdomain: use Next.js middleware to **rewrite** (not redirect) based on the request's `Host` header, so `campaign.otherdomain.com/` transparently serves `/campaign/landing-page` from the same app/deploy — no separate hosting needed

---

## 12. Performance patterns worth carrying over

- Any continuously-running visual effect (a logo marquee, an infinite carousel) — **use a CSS `@keyframes` animation**, not a `requestAnimationFrame` loop mutating `style.transform` every frame. The latter is a measured, significant contributor to mobile Total Blocking Time.
- Any DOM-scanning setup effect (e.g., "reveal on scroll" observers) — **batch all `getBoundingClientRect()` reads before any `classList` writes**; interleaving read/write per element forces a synchronous layout per iteration ("forced reflow").
- Prefer `revalidate = N` (ISR) over `dynamic = 'force-dynamic'` for pages backed by admin-editable but low-frequency-changing content (home, listing pages) — this was the single biggest TTFB win available.
- Don't `<link rel="preload">` a hero image in the **root** layout if only the homepage uses it — every other route pays for a preload it never uses.
- A full-viewport "banner" image sitting behind an *opaque* color overlay is a wasted high-priority network request on every page that uses the shared banner component — either drop the image or make the overlay semi-transparent.

---

## 13. Security baseline

- CSP header covering `default-src 'self'` plus an explicit, minimal allowlist per directive (script/style/img/frame/connect) — add a new external domain only when something genuinely needs to load from it, and remove it again if that need goes away (an avatar that got downloaded-and-localized no longer needs its origin in `img-src`)
- HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`
- scrypt password hashing (Node built-in `crypto`, no external password-hashing dependency needed)
- HTTP-only, `secure` (in production), `sameSite: lax` session cookies
- Every admin mutation route re-checks permission server-side; never rely on the client hiding a button
- Account deactivation as a first-class feature (not just "set an unguessable password and hope") for any pseudonymous/departed-user account — enforce at both login time and on every authenticated request, so a mid-session deactivation takes effect immediately

---

## 14. What "done" looks like — a checklist for the new project

- [ ] Three separate SQLite DBs (content / page-metadata / analytics), each with idempotent self-migrating schema
- [ ] Explicit pull vs. push sync scripts with different safety policies; loud documentation of the "never auto-pull over uncommitted local changes" risk
- [ ] Admin portal: auth with OTP + sliding session, role-based permissions, one module per content type, trash/restore, settings-as-data
- [ ] Audit log wired into every mutation, with a filterable admin view
- [ ] Blog: sanitize-on-render **and** sanitize-on-publish, author avatars with sensible defaults + fallback resolution, RSS feed
- [ ] SEO: unique metadata everywhere, JSON-LD, sitemap, robots.txt (correct per-bot groups), llms.txt generated from live data
- [ ] ADA: skip link, landmarks, focus-visible, reduced-motion, alt text, keyboard-operable modals
- [ ] Search and Chatbot built as two **fully independent** stacks sharing only the underlying content, both respecting the same admin on/off toggles
- [ ] Chatbot has a name, a face, page-aware non-repetitive greetings, and a system prompt tuned for natural tone
- [ ] Lead forms: honeypot + timing always on, optional Turnstile, unified analytics with a `form_type` label
- [ ] Performance: CSS-driven ambient animation, batched DOM reads, ISR over force-dynamic where possible
- [ ] Security headers minimal and current; no third-party runtime dependency for anything that can be downloaded once and self-hosted
