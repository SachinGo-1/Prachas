# Prachas Technologies — Website & Admin Portal

A modern, fully responsive marketing website and admin portal for **Prachas
Technologies**, a Hyderabad-based staffing, recruiting, and BPO firm serving
US businesses.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**,
shadcn/ui-style components, **Prisma** (SQLite in dev, Postgres-ready),
**NextAuth**, **React Hook Form + Zod**, and **Nodemailer**.

---

## Features

### Public site
- **Home** — animated grid-pulse hero (respects `prefers-reduced-motion`),
  stats bar, services overview, "Why Prachas", and a CTA banner.
- **Services** — tabbed detail for all five practice areas, deep-linkable
  by hash (e.g. `/services#bpo`).
- **About** — company story, mission & values, milestone timeline, and a
  team section driven by the database (managed from the admin portal).
- **Careers** — open positions pulled live from the database, with an
  "Apply Now" modal that uploads a PDF résumé and emails a notification.
- **Contact** — validated inquiry form, contact details, business hours
  (IST/EST), and an embedded map.

### Admin portal (`/admin`, auth-protected)
- **Dashboard** — KPI cards + recent activity feeds + quick actions.
- **Job Postings** — full CRUD, inline status toggle, applicant counts,
  delete confirmation.
- **Applications** — filter (job/status/date), inline + bulk status updates,
  résumé download, detail view, and CSV export.
- **Inquiries** — filter, read/unread, archive, and reply via `mailto:`.
- **Team** — CRUD with photo upload; changes appear on the public About page.
- **Settings** — company info, business hours, notification email, and a
  change-password form.

### Quality
- Mobile-first responsive layout (tested at 375 / 768 / 1280px).
- Semantic HTML, ARIA labels, and visible brand-colored focus rings.
- All `/admin` routes protected by middleware; unauthenticated users are
  redirected to `/admin/login`.
- Loading states on every async action; error boundary on admin pages.

---

## Tech stack

| Concern     | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 14 (App Router, RSC)                        |
| Language    | TypeScript                                          |
| Styling     | Tailwind CSS + shadcn/ui-style primitives           |
| Auth        | NextAuth.js (Credentials provider, JWT sessions)    |
| Database    | Prisma ORM — SQLite (dev), PostgreSQL-ready schema  |
| Forms       | React Hook Form + Zod                               |
| Icons       | Lucide React                                        |
| Email       | Nodemailer (logs to console when SMTP is unset)     |
| Uploads     | Local `public/uploads` (résumés & team photos)      |

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
Then edit `.env`. At minimum set a real `NEXTAUTH_SECRET`:
```bash
# generate one:
openssl rand -base64 32
```
SMTP values are optional — if left blank, outgoing emails are logged to the
server console instead of sent, so forms still work end-to-end in dev.

### 3. Migrate the database
```bash
npx prisma migrate dev
```

### 4. Seed data
```bash
npx prisma db seed
```
This creates the admin user, 3 job postings, 2 inquiries, 4 team members,
and default site settings.

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
| `SMTP_HOST`       | SMTP server host (optional)                         |
| `SMTP_PORT`       | SMTP port (default `587`; `465` uses TLS)           |
| `SMTP_USER`       | SMTP username / from address (optional)             |
| `SMTP_PASS`       | SMTP password / app password (optional)             |
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

## Switching to PostgreSQL (production)

1. In `prisma/schema.prisma`, change the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Point `DATABASE_URL` at your Postgres instance.
3. Run `npx prisma migrate dev` (or `migrate deploy` in CI/prod).

The models are written to be portable across SQLite and PostgreSQL.

---

## Project structure

```
app/
  (public)/            # Public site (Home, Services, About, Careers, Contact)
  admin/
    login/             # Login page (outside the admin shell)
    (panel)/           # Auth-guarded admin shell + pages
  api/                 # Route handlers (auth, contact, careers, admin/*)
components/
  public/              # Navbar, Footer, Hero, forms, etc.
  admin/               # Sidebar, TopBar, tables, managers, forms
  ui/                  # shadcn/ui-style primitives
lib/                   # prisma, auth, email, settings, validations, utils
prisma/                # schema, migrations, seed
public/uploads/        # Résumé & team-photo uploads
```

---

## Notes
- Résumé uploads are limited to PDF, max 5MB; team photos to images, max 3MB.
- Uploaded files live under `public/uploads` and are git-ignored.
- Emails degrade gracefully: without SMTP configured, they are logged, so no
  submission ever fails due to mail configuration.
