# Prachas Technologies — Website & Admin Portal

A modern, fully responsive marketing website and content-managed admin portal
for **Prachas Technologies**, a Hyderabad-based recruiting, staffing, BPO, and
consulting firm serving US businesses.

The design is dark and cinematic — **near-black charcoal surfaces with a lime-green
accent**, Poppins/Inter/JetBrains Mono typography, and a signature lime "scanning
line" that sweeps across the hero on load (and respects `prefers-reduced-motion`).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
shadcn/ui-style components, **Prisma** (SQLite in dev, Postgres-ready),
**NextAuth**, **React Hook Form + Zod**, **@uiw/react-md-editor**, and **Nodemailer**.

---

## Features

### Public site (7 pages)
- **Home** (`/`) — full-viewport hero with the lime scanning-line animation and a
  static dot grid, stats strip, services teaser, "Why Prachas", an industries tag
  cloud, testimonials, and a CTA banner.
- **About** (`/about`) — mission statement, milestone timeline, values, a
  DB-driven team grid (with initials-avatar fallback), and the stats strip.
- **Services** (`/services`) — six services in an alternating layout, copy pulled
  live from the database, deep-linkable by hash (e.g. `/services#bpo`).
- **Blog** (`/blog`, `/blog/[slug]`) — category-filtered, paginated list plus
  Markdown-rendered posts, all managed from the admin portal.
- **Contact** (`/contact`) — validated inquiry form (field-level errors), contact
  panel with IST/ET business hours, and an embedded Hyderabad map.
- **Join Us** (`/join-us`) — culture pitch, benefits, a 4-step hiring process, and
  a general application form with résumé upload.
- **Jobs** (`/jobs`) — filterable open positions with an inline "Apply Now" modal.

### Admin portal (`/admin`, auth-protected)
- **Dashboard** — KPI cards (active jobs, applications this month, unread inquiries,
  published posts), a unified recent-activity feed, and quick actions.
- **Blog Posts** — full CRUD with a Markdown editor, auto-slugging, cover-image
  upload, tags, and draft/publish workflow.
- **Job Postings** — full CRUD, status workflow, applicant context, delete confirm.
- **Applications** — filter (job / department / status / date), inline + bulk status
  updates, résumé download, detail drawer, and CSV export.
- **Inquiries** — filter, read/unread, archive, and reply via `mailto:`.
- **Services** — edit each service's copy, benefits, industries, and order; changes
  appear immediately on the public site.
- **Team Members** — CRUD with photo upload and display ordering.
- **Settings** — company info, business hours, social links, notification email,
  contact-form CC recipients, and a change-password form.

### Quality
- Mobile-first responsive layout (375 / 768 / 1280px).
- Semantic HTML, ARIA labels, and visible lime focus rings.
- All `/admin` routes protected by middleware; unauthenticated users redirect to
  `/admin/login`. Admin APIs return `401` without a session.
- Emails never block or fail submissions — SMTP has short connect timeouts and
  falls back to console logging when unconfigured.

---

## Tech stack

| Concern     | Choice                                                    |
| ----------- | --------------------------------------------------------- |
| Framework   | Next.js 14 (App Router, RSC)                              |
| Language    | TypeScript                                                |
| Styling     | Tailwind CSS + CSS custom properties (brand tokens)       |
| Components  | shadcn/ui-style primitives (dark theme)                   |
| Auth        | NextAuth.js (Credentials provider, JWT sessions)          |
| Database    | Prisma ORM — SQLite (dev), PostgreSQL-ready schema        |
| Forms       | React Hook Form + Zod                                     |
| Rich text   | @uiw/react-md-editor (edit) + react-markdown (render)     |
| Icons       | Lucide React                                              |
| Email       | Nodemailer (console-logs when SMTP is unset)              |
| Uploads     | Local `public/uploads` (résumés & images)                 |

---

## Getting started

### Prerequisites
- Node.js 18.18+ (Node 20+ recommended)
- npm

### 1. Clone & install
```bash
git clone <repo-url>
cd prachas-website
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Then edit `.env` and set a real `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```
SMTP is optional — leave `SMTP_HOST/USER/PASS` blank and outgoing emails are
logged to the console instead of sent, so every form still works end-to-end.

### 3. Migrate the database
```bash
npx prisma migrate dev
```

### 4. Seed data
```bash
npx prisma db seed
```
This creates the admin user, 3 published blog posts, 6 services, 4 active job
postings, 2 sample applications, 2 inquiries, 3 team members, and default settings.

### 5. Run
```bash
npm run dev
```
Open <http://localhost:3000>.

---

## Admin login

| Field    | Value               |
| -------- | ------------------- |
| URL      | `/admin`            |
| Email    | `admin@prachas.com` |
| Password | `Prachas@2024`      |

Visiting `/admin` while signed out redirects to `/admin/login`.

---

## Environment variables

| Variable          | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `DATABASE_URL`    | Prisma connection string (`file:./dev.db` for dev)  |
| `NEXTAUTH_SECRET` | Secret used to sign JWT sessions (**required**)     |
| `NEXTAUTH_URL`    | App base URL (e.g. `http://localhost:3000`)         |
| `SMTP_HOST`       | SMTP server host (blank → log to console)           |
| `SMTP_PORT`       | SMTP port (default `587`; `465` uses TLS)           |
| `SMTP_USER`       | SMTP username / from address                        |
| `SMTP_PASS`       | SMTP password / app password                        |
| `ADMIN_EMAIL`     | Fallback recipient for form notifications           |

---

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the dev server                 |
| `npm run build`      | Generate Prisma client + build       |
| `npm run start`      | Start the production server          |
| `npm run lint`       | Run ESLint                           |
| `npm run db:migrate` | `prisma migrate dev`                 |
| `npm run db:seed`    | Seed the database                    |
| `npm run db:studio`  | Open Prisma Studio                   |

---

## Design tokens

Brand tokens live in `app/globals.css` (as CSS custom properties feeding
shadcn/ui) and `tailwind.config.ts` (flat utility classes):

| Token        | Value     | Usage                          |
| ------------ | --------- | ------------------------------ |
| `bg`         | `#111111` | Page background                |
| `bg-card`    | `#1A1A1A` | Cards / panels                 |
| `bg-raised`  | `#222222` | Raised surfaces / nav          |
| `accent`     | `#00E676` | Lime green — primary accent    |
| `accent-dim` | `#00B85A` | Hover / pressed accent         |
| `foreground` | `#F0F0F0` | Primary text                   |
| `border`     | `#2A2A2A` | Subtle borders                 |

Fonts: Poppins (`font-display`), Inter (`font-body`), JetBrains Mono (`font-mono`).

---

## Switching to PostgreSQL (production)

1. In `prisma/schema.prisma`, change the datasource provider to `postgresql`.
2. Point `DATABASE_URL` at your Postgres instance.
3. Run `npx prisma migrate dev` (or `migrate deploy` in CI/prod).

The models are written to be portable across SQLite and PostgreSQL.

---

## Project structure

```
app/
  (public)/            # Home, About, Services, Blog, Contact, Join Us, Jobs
  admin/
    login/             # Login page (outside the admin shell)
    (panel)/           # Auth-guarded admin shell + pages
  api/                 # Route handlers (auth, contact, jobs/join-us apply, admin/*)
components/
  public/              # Navbar, Footer, Hero, Logo, cards, forms
  admin/               # Sidebar, TopBar, managers, forms, markdown editor
  ui/                  # shadcn/ui-style primitives
lib/                   # prisma, auth, email, settings, validations, utils
prisma/                # schema, migrations, seed
public/uploads/        # Résumé & image uploads (git-ignored)
```

---

## Notes
- Résumé uploads are limited to PDF, max 5MB; images to 3MB.
- Uploaded files live under `public/uploads` and are git-ignored.
- Emails degrade gracefully: without SMTP, they log to the console, so no
  submission ever fails due to mail configuration.
