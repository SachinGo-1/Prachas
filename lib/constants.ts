import type { LucideIcon } from "lucide-react";
import {
  Users,
  Building2,
  Cpu,
  Wallet,
  Search,
  Lightbulb,
  Clock,
  ShieldCheck,
  Headset,
  TrendingUp,
  Globe2,
  HeartHandshake,
  BadgeDollarSign,
} from "lucide-react";

export const SITE = {
  name: "Prachas Technologies",
  shortName: "Prachas",
  tagline: "Where Indian Talent Meets American Ambition",
  email: "info@prachas.com",
  phone: "+91 40 4567 8900",
  addressLines: [
    "Prachas Technologies Pvt. Ltd.",
    "HITEC City, Hyderabad",
    "Telangana 500081, India",
  ],
  linkedin: "https://www.linkedin.com/company/prachas-technologies",
  twitter: "https://twitter.com/prachastech",
  foundedYear: 2013,
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/jobs", label: "Jobs" },
  { href: "/contact", label: "Contact" },
];

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export type ServiceSeed = {
  slug: string;
  title: string;
  icon: LucideIcon;
  short: string;
  description: string;
  benefits: string[];
  industries: string[];
};

export const SERVICES: ServiceSeed[] = [
  {
    slug: "recruiting",
    title: "Recruiting & Talent Acquisition",
    icon: Users,
    short: "End-to-end sourcing and hiring for hard-to-fill US roles.",
    description:
      "Our recruiting practice pairs deep US-market knowledge with a large Hyderabad-based sourcing team to fill roles fast and accurately. We run the full lifecycle — from intake and market mapping to sourcing, screening, and offer management — while your hiring managers stay focused on evaluating the best-fit candidates.\n\nEvery search is calibrated with a scorecard, structured interviews, and transparent pipeline reporting, so you always know where each requisition stands. We treat your employer brand as our own, giving every candidate a responsive, respectful experience from first contact to offer.\n\nWhether you need a single niche hire or a scaled hiring surge, our teams flex to your volume and your time zones — plugging into your ATS and workflows rather than forcing you into ours.",
    benefits: [
      "Dedicated recruiters aligned to US business hours",
      "Calibrated scorecards and structured interview kits",
      "Transparent, real-time pipeline reporting",
    ],
    industries: ["Technology", "Healthcare", "Finance", "Manufacturing"],
  },
  {
    slug: "bpo",
    title: "BPO / Back-Office Outsourcing",
    icon: Building2,
    short: "Reliable back-office operations that scale with your business.",
    description:
      "We operate secure, process-driven back-office teams that handle the repetitive, high-volume work slowing your operation down — data management, document processing, order handling, verification, and customer support.\n\nOur delivery model combines documented SOPs, quality audits, and tiered escalation so accuracy stays high as volume grows. Teams are onboarded against your playbooks and monitored with SLA dashboards, giving you predictable throughput and measurable quality.\n\nThe result is lower operating cost without the loss of control that often comes with outsourcing — you keep visibility, we keep the queue clear.",
    benefits: [
      "Documented SOPs with built-in quality audits",
      "SLA dashboards for throughput and accuracy",
      "Elastic capacity for seasonal spikes",
    ],
    industries: ["Insurance", "Retail", "Logistics", "Healthcare"],
  },
  {
    slug: "it-staffing",
    title: "IT Staffing",
    icon: Cpu,
    short: "Contract, contract-to-hire, and project consultants on demand.",
    description:
      "Access a deep bench of vetted engineers, analysts, and architects for contract, contract-to-hire, and project-based needs. We specialize in the stacks US enterprises actually run — Java, .NET, cloud, data engineering, and QA — and pre-screen every consultant for technical depth and communication.\n\nOur engagements can be staffed as embedded individuals or as managed pods with a lead, giving you a single point of accountability. Rate cards are transparent and compliance is handled end-to-end, so onboarding is fast and audit-ready.\n\nWhen priorities shift, we scale the bench with you — ramping specialists up or down without the overhead of direct hiring.",
    benefits: [
      "Pre-vetted consultants across modern enterprise stacks",
      "Individual or managed-pod delivery models",
      "Transparent rate cards and fast onboarding",
    ],
    industries: ["Technology", "Finance", "Retail", "Government"],
  },
  {
    slug: "executive-search",
    title: "Executive Search",
    icon: Search,
    short: "Confidential search for leadership and hard-to-fill roles.",
    description:
      "Our executive search practice runs confidential, research-led engagements for director, VP, and C-level roles. We begin with a rigorous role and market analysis, then map the target universe of candidates before making discreet, thoughtful approaches.\n\nEach shortlist is backed by in-depth assessment against leadership competencies and cultural fit, with reference and background diligence handled end-to-end. We keep communication tight and honest throughout, so you make high-stakes decisions with complete, well-organized information.\n\nEvery search closes with a structured onboarding plan, so your new leader is set up to succeed from day one.",
    benefits: [
      "Confidential, research-led candidate mapping",
      "Leadership competency and culture-fit assessment",
      "End-to-end reference and background diligence",
    ],
    industries: ["Technology", "Finance", "Healthcare", "Manufacturing"],
  },
  {
    slug: "hr-payroll",
    title: "HR & Payroll Solutions",
    icon: Wallet,
    short: "Compliant payroll, benefits, and HR administration support.",
    description:
      "We take the administrative weight of HR and payroll off your team while keeping you compliant across jurisdictions. Our specialists handle payroll processing, timesheet management, benefits administration, onboarding, and offboarding with meticulous documentation and audit trails.\n\nEmployees get responsive support, and you get accurate, on-time runs with clear reporting. As your headcount changes, our processes scale with you — no need to expand your internal back office to keep pace.\n\nWe integrate with your existing HRIS and payroll platforms, so adopting our support is a hand-off, not a migration.",
    benefits: [
      "Accurate, on-time payroll with full audit trails",
      "Benefits and timesheet administration",
      "Responsive employee support",
    ],
    industries: ["Technology", "Insurance", "Healthcare", "Retail"],
  },
  {
    slug: "consulting",
    title: "Consulting & Solutions",
    icon: Lightbulb,
    short: "Advisory and delivery for talent, process, and technology.",
    description:
      "Our consulting practice helps US businesses design the operating models that let offshore delivery actually work. We advise on talent strategy, process re-engineering, and the technology that ties them together — then stay on to deliver, not just recommend.\n\nEngagements are scoped tightly around outcomes: a faster hiring funnel, a cleaner back-office process, a migration that lands on time. We bring cross-functional pods that combine domain, recruiting, and technical expertise under one accountable lead.\n\nWhether you're standing up a new capability or fixing one that's stalled, we bridge strategy and execution so the plan survives contact with reality.",
    benefits: [
      "Outcome-scoped engagements with clear milestones",
      "Cross-functional pods under a single lead",
      "Advisory plus hands-on delivery",
    ],
    industries: ["Technology", "Finance", "Logistics", "Government"],
  },
];

/** slug → Lucide icon, for rendering DB-sourced services. */
export const SERVICE_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  SERVICES.map((s) => [s.slug, s.icon])
);

export const STATS = [
  { value: "11+", label: "Years Operating" },
  { value: "500+", label: "Placements" },
  { value: "50+", label: "US Clients" },
  { value: "98%", label: "Retention" },
];

/** Home "Why Prachas" — 4 bullets rendered with lime dot markers. */
export const WHY_PRACHAS = [
  {
    icon: Clock,
    title: "Time-zone overlap",
    body: "Dedicated teams work aligned to US business hours, so collaboration feels local — not offshore.",
  },
  {
    icon: ShieldCheck,
    title: "US compliance awareness",
    body: "We build processes with US data security, ITAR sensitivity, and audit-readiness in mind from day one.",
  },
  {
    icon: Headset,
    title: "Dedicated account managers",
    body: "A named account manager owns your relationship end-to-end — one point of contact, full accountability.",
  },
  {
    icon: TrendingUp,
    title: "11 years of track record",
    body: "Over a decade placing talent and running operations for US businesses, with a 98% retention rate.",
  },
];

export const VALUES = [
  {
    title: "Precision",
    body: "We measure twice and deliver once. Accuracy in sourcing, process, and reporting is non-negotiable.",
  },
  {
    title: "Partnership",
    body: "We operate as an extension of your team, aligned to your goals and your time zones.",
  },
  {
    title: "People",
    body: "Great outcomes come from great people — for our clients, our candidates, and our own teams.",
  },
];

export const TIMELINE = [
  {
    year: "2013",
    title: "Founded in Hyderabad",
    body: "Prachas opens its doors with a small recruiting team focused on the US market.",
  },
  {
    year: "2016",
    title: "BPO practice launched",
    body: "Back-office delivery added to serve growing operational demand from US clients.",
  },
  {
    year: "2019",
    title: "50+ US clients",
    body: "Crossed 50 active US client relationships across technology and healthcare.",
  },
  {
    year: "2022",
    title: "IT staffing scale-up",
    body: "Expanded the consultant bench and launched managed-pod delivery.",
  },
  {
    year: "2025",
    title: "500+ placements",
    body: "Surpassed 500 lifetime placements with a 98% client retention rate.",
  },
];

export const INDUSTRIES = [
  "Healthcare",
  "Finance",
  "Technology",
  "Retail",
  "Government",
  "Logistics",
  "Insurance",
  "Manufacturing",
];

export const TESTIMONIALS = [
  {
    quote:
      "Prachas plugged into our hiring process like an in-house team. The time-zone overlap alone changed how fast we could move on candidates.",
    name: "Director of Talent",
    company: "US Healthcare SaaS",
  },
  {
    quote:
      "Their back-office pod cleared a backlog we'd been fighting for months, and the SLA reporting meant we never had to guess where things stood.",
    name: "VP of Operations",
    company: "National Insurance Brokerage",
  },
];

/** Join Us — why work here. */
export const JOIN_BENEFITS = [
  {
    icon: TrendingUp,
    title: "Growth Opportunities",
    body: "Clear progression paths, mentorship, and the chance to own real client relationships early.",
  },
  {
    icon: Globe2,
    title: "US Exposure",
    body: "Work directly with US businesses and hiring leaders — global experience without leaving Hyderabad.",
  },
  {
    icon: HeartHandshake,
    title: "Collaborative Culture",
    body: "A supportive, low-ego team that wins together and invests in each other's success.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pay",
    body: "Market-leading compensation, performance incentives, and benefits that reward great work.",
  },
];

/** Join Us — how we hire. */
export const HIRING_STEPS = [
  { step: "01", title: "Apply", body: "Send us your resume and a short note about what you're looking for." },
  { step: "02", title: "Screen", body: "A quick call to understand your goals, experience, and fit." },
  { step: "03", title: "Interview", body: "Meet the team and dig into the role, the work, and your questions." },
  { step: "04", title: "Offer", body: "We move fast — a clear offer and a warm onboarding into the team." },
];

/* -------------------------------------------------------------------------- */
/* Enumerations                                                                */
/* -------------------------------------------------------------------------- */

export const BLOG_CATEGORIES = [
  "Recruiting",
  "HR",
  "Technology",
  "Industry News",
] as const;

export const BLOG_FILTERS = ["All", ...BLOG_CATEGORIES] as const;

export const JOB_DEPARTMENTS = [
  "Recruiting",
  "Technology",
  "Operations",
  "HR",
  "Sales",
  "Other",
] as const;

export const SERVICE_INTEREST_OPTIONS = SERVICES.map((s) => s.title).concat([
  "General Inquiry",
]);

export const APPLICATION_STATUSES = [
  "new",
  "reviewed",
  "shortlisted",
  "rejected",
] as const;
export const JOB_STATUSES = ["active", "draft", "closed"] as const;
export const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract"] as const;

export const BLOG_POSTS_PER_PAGE = 6;
