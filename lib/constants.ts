import type { LucideIcon } from "lucide-react";
import {
  Users,
  Building2,
  Cpu,
  Wallet,
  Search,
  Clock,
  ShieldCheck,
  Headset,
} from "lucide-react";

export const SITE = {
  name: "Prachas Technologies",
  shortName: "Prachas",
  tagline: "Bridging US Growth with India's Talent",
  email: "info@prachas.com",
  phone: "+91 40 1234 5678",
  addressLines: ["Prachas Technologies Pvt. Ltd.", "HITEC City, Hyderabad", "Telangana 500081, India"],
  linkedin: "https://www.linkedin.com/company/prachas-technologies",
  foundedYear: 2013,
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export type Service = {
  slug: string;
  title: string;
  icon: LucideIcon;
  short: string;
  description: string;
  benefits: string[];
  industries: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "recruiting",
    title: "Recruiting & Talent Acquisition",
    icon: Users,
    short: "End-to-end sourcing and hiring for hard-to-fill US roles.",
    description:
      "Our recruiting practice pairs deep US-market knowledge with a large Hyderabad-based sourcing team to fill roles fast and accurately. We run the full lifecycle — from intake and market mapping to sourcing, screening, and offer management — while your hiring managers stay focused on evaluating the best-fit candidates. Every search is calibrated with a scorecard, structured interviews, and transparent pipeline reporting, so you always know where each requisition stands. Whether you need a single niche hire or a scaled hiring surge, our teams flex to your volume and time zones.",
    benefits: [
      "Dedicated recruiters aligned to US business hours",
      "Calibrated scorecards and structured interview kits",
      "Transparent, real-time pipeline reporting",
    ],
    industries: ["Technology", "Healthcare", "Financial Services", "Manufacturing"],
  },
  {
    slug: "bpo",
    title: "BPO / Back-Office Outsourcing",
    icon: Building2,
    short: "Reliable back-office operations that scale with your business.",
    description:
      "We operate secure, process-driven back-office teams that handle the repetitive, high-volume work slowing your operation down — data management, document processing, order handling, verification, and customer support. Our delivery model combines documented SOPs, quality audits, and tiered escalation so accuracy stays high as volume grows. Teams are onboarded against your playbooks and monitored with SLA dashboards, giving you predictable throughput and measurable quality. The result is lower operating cost without the loss of control that often comes with outsourcing.",
    benefits: [
      "Documented SOPs with built-in quality audits",
      "SLA dashboards for throughput and accuracy",
      "Elastic capacity for seasonal spikes",
    ],
    industries: ["Insurance", "E-commerce", "Logistics", "Healthcare"],
  },
  {
    slug: "it-staffing",
    title: "IT Staffing & Consulting",
    icon: Cpu,
    short: "Contract, contract-to-hire, and project consultants on demand.",
    description:
      "Access a deep bench of vetted engineers, analysts, and architects for contract, contract-to-hire, and project-based needs. We specialize in the stacks US enterprises actually run — Java, .NET, cloud, data engineering, and QA — and pre-screen every consultant for technical depth and communication. Our consulting engagements can be staffed as embedded individuals or as managed pods with a lead, giving you a single point of accountability. Rate cards are transparent and compliance is handled end-to-end, so onboarding is fast and audit-ready.",
    benefits: [
      "Pre-vetted consultants across modern enterprise stacks",
      "Individual or managed-pod delivery models",
      "Transparent rate cards and fast onboarding",
    ],
    industries: ["Technology", "Financial Services", "Retail", "Public Sector"],
  },
  {
    slug: "hr-payroll",
    title: "HR & Payroll Solutions",
    icon: Wallet,
    short: "Compliant payroll, benefits, and HR administration support.",
    description:
      "We take the administrative weight of HR and payroll off your team while keeping you compliant across jurisdictions. Our specialists handle payroll processing, timesheet management, benefits administration, onboarding, and offboarding with meticulous documentation and audit trails. Employees get responsive support, and you get accurate, on-time runs with clear reporting. As your headcount changes, our processes scale with you — no need to expand your internal back office to keep pace.",
    benefits: [
      "Accurate, on-time payroll with full audit trails",
      "Benefits and timesheet administration",
      "Responsive employee support",
    ],
    industries: ["Technology", "Staffing Agencies", "Healthcare", "Professional Services"],
  },
  {
    slug: "executive-search",
    title: "Executive Search",
    icon: Search,
    short: "Confidential search for leadership and hard-to-fill roles.",
    description:
      "Our executive search practice runs confidential, research-led engagements for director, VP, and C-level roles. We begin with a rigorous role and market analysis, then map the target universe of candidates before making discreet, thoughtful approaches. Each shortlist is backed by in-depth assessment against leadership competencies and cultural fit, with reference and background diligence handled end-to-end. We keep communication tight and honest throughout, so you make high-stakes decisions with complete, well-organized information.",
    benefits: [
      "Confidential, research-led candidate mapping",
      "Leadership competency and culture-fit assessment",
      "End-to-end reference and background diligence",
    ],
    industries: ["Technology", "Financial Services", "Healthcare", "Manufacturing"],
  },
];

export const STATS = [
  { value: "11+", label: "Years in Operation" },
  { value: "500+", label: "Placements Made" },
  { value: "50+", label: "US Clients Served" },
  { value: "98%", label: "Client Retention Rate" },
];

export const WHY_PRACHAS = [
  {
    icon: Clock,
    title: "US Time-Zone Overlap",
    body: "Dedicated teams work aligned to US business hours, so collaboration feels local — not offshore.",
  },
  {
    icon: ShieldCheck,
    title: "ITAR & Compliance Awareness",
    body: "We build processes with data security, ITAR sensitivity, and audit-readiness in mind from day one.",
  },
  {
    icon: Headset,
    title: "Dedicated Account Management",
    body: "A named account manager owns your relationship end-to-end — one point of contact, full accountability.",
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
  { year: "2013", title: "Founded in Hyderabad", body: "Prachas opens its doors with a small recruiting team focused on the US market." },
  { year: "2016", title: "BPO practice launched", body: "Back-office delivery added to serve growing operational demand from US clients." },
  { year: "2019", title: "50+ US clients", body: "Crossed 50 active US client relationships across technology and healthcare." },
  { year: "2022", title: "IT staffing scale-up", body: "Expanded the consultant bench and launched managed-pod delivery." },
  { year: "2025", title: "500+ placements", body: "Surpassed 500 lifetime placements with a 98% client retention rate." },
];

export const SERVICE_INTEREST_OPTIONS = SERVICES.map((s) => s.title).concat([
  "General Inquiry",
]);

export const APPLICATION_STATUSES = ["new", "reviewed", "shortlisted", "rejected"] as const;
export const JOB_STATUSES = ["active", "draft", "closed"] as const;
export const EMPLOYMENT_TYPES = ["full-time", "part-time", "contract"] as const;
