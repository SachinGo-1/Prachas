import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/* Service seed data — kept in sync with lib/constants.ts SERVICES.
   Inlined here (rather than imported via the "@/" alias) so the seed
   runs under bare ts-node without extra path resolution. */
const SERVICES = [
  {
    slug: "recruiting",
    title: "Recruiting & Talent Acquisition",
    shortDesc: "End-to-end sourcing and hiring for hard-to-fill US roles.",
    longDesc:
      "Our recruiting practice pairs deep US-market knowledge with a large Hyderabad-based sourcing team to fill roles fast and accurately. We run the full lifecycle — from intake and market mapping to sourcing, screening, and offer management.\n\nEvery search is calibrated with a scorecard, structured interviews, and transparent pipeline reporting, so you always know where each requisition stands.",
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
    shortDesc: "Reliable back-office operations that scale with your business.",
    longDesc:
      "We operate secure, process-driven back-office teams that handle the repetitive, high-volume work slowing your operation down — data management, document processing, order handling, verification, and customer support.\n\nOur delivery model combines documented SOPs, quality audits, and tiered escalation so accuracy stays high as volume grows.",
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
    shortDesc: "Contract, contract-to-hire, and project consultants on demand.",
    longDesc:
      "Access a deep bench of vetted engineers, analysts, and architects for contract, contract-to-hire, and project-based needs. We specialize in the stacks US enterprises actually run — Java, .NET, cloud, data engineering, and QA.\n\nEngagements can be staffed as embedded individuals or as managed pods with a lead, giving you a single point of accountability.",
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
    shortDesc: "Confidential search for leadership and hard-to-fill roles.",
    longDesc:
      "Our executive search practice runs confidential, research-led engagements for director, VP, and C-level roles. We begin with a rigorous role and market analysis, then map the target universe of candidates before making discreet approaches.\n\nEach shortlist is backed by in-depth assessment against leadership competencies and cultural fit.",
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
    shortDesc: "Compliant payroll, benefits, and HR administration support.",
    longDesc:
      "We take the administrative weight of HR and payroll off your team while keeping you compliant across jurisdictions. Our specialists handle payroll processing, timesheet management, benefits administration, onboarding, and offboarding.\n\nEmployees get responsive support, and you get accurate, on-time runs with clear reporting.",
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
    shortDesc: "Advisory and delivery for talent, process, and technology.",
    longDesc:
      "Our consulting practice helps US businesses design the operating models that let offshore delivery actually work. We advise on talent strategy, process re-engineering, and the technology that ties them together — then stay on to deliver, not just recommend.\n\nEngagements are scoped tightly around outcomes.",
    benefits: [
      "Outcome-scoped engagements with clear milestones",
      "Cross-functional pods under a single lead",
      "Advisory plus hands-on delivery",
    ],
    industries: ["Technology", "Finance", "Logistics", "Government"],
  },
];

const BLOG_POSTS = [
  {
    title: "How to Hire Remote Developers from India",
    slug: "how-to-hire-remote-developers-from-india",
    category: "Recruiting",
    author: "Priya Sharma",
    tags: "remote hiring, developers, india, staffing",
    excerpt:
      "A practical playbook for US companies building engineering teams in India — from sourcing to onboarding and everything between.",
    body: `## Start with the right operating model

Hiring remote developers from India works best when you treat it as an extension of your team, not a transaction. Decide up front whether you want **direct hires**, **contract consultants**, or a **managed pod** with a lead who owns delivery.

## Source where the talent actually is

Hyderabad, Bengaluru, and Pune have deep pools of engineers across the stacks US enterprises run:

- Java / Spring Boot
- .NET
- Cloud (AWS, Azure)
- Data engineering & QA

## Screen for communication, not just code

The best offshore hires are strong communicators. Use structured interviews and a scorecard so every candidate is measured the same way.

## Onboard for time-zone overlap

Set a few hours of daily overlap with US business hours. That overlap is where collaboration actually happens — standups, reviews, and quick unblocks.

> The teams that win offshore are the ones that invest in onboarding as seriously as they invest in sourcing.`,
    status: "published",
    daysAgo: 6,
  },
  {
    title: "Top Staffing Trends for 2024",
    slug: "top-staffing-trends-2024",
    category: "Industry News",
    author: "Vikram Nair",
    tags: "staffing, trends, 2024, workforce",
    excerpt:
      "The forces reshaping how US companies build teams this year — from skills-based hiring to the rise of managed delivery pods.",
    body: `## 1. Skills-based hiring goes mainstream

Degrees matter less; demonstrable skills matter more. Structured assessments are replacing résumé keyword matching.

## 2. Managed pods over staff augmentation

Companies increasingly want a **single accountable partner**, not a stack of individual contractors. Managed pods bundle recruiting, domain, and technical expertise under one lead.

## 3. Compliance moves upstream

Data security and audit-readiness are now part of the *sourcing* conversation, not an afterthought at contract signing.

## 4. Global-local delivery

The winning model pairs global talent with local-hours collaboration. Time-zone overlap is the new table stakes.`,
    status: "published",
    daysAgo: 3,
  },
  {
    title: "Why US Companies Choose Hyderabad",
    slug: "why-us-companies-choose-hyderabad",
    category: "Technology",
    author: "Ananya Rao",
    tags: "hyderabad, offshore, technology, delivery",
    excerpt:
      "Hyderabad has quietly become a first choice for US companies building offshore teams. Here's what's driving the shift.",
    body: `## A deep, mature talent pool

Hyderabad's tech ecosystem — anchored by HITEC City — produces a steady stream of engineers, analysts, and operations talent with real enterprise experience.

## Infrastructure that just works

Reliable connectivity, modern office space, and a concentration of global capability centers make it easy to stand up a team quickly.

## Cost without compromise

You get meaningful cost advantages **without** trading away quality or communication — the combination that makes offshore delivery sustainable.

## A partner on the ground matters

The difference between a good and a great Hyderabad team is usually the partner running it. Local leadership, US-hours alignment, and a candidate-first culture are what turn a cost center into a competitive advantage.`,
    status: "published",
    daysAgo: 1,
  },
];

async function main() {
  // --- Admin user ---------------------------------------------------------
  const adminEmail = "admin@prachas.com";
  const adminPassword = "Prachas@2024";
  const hashed = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashed, name: "Prachas Admin", role: "admin" },
    create: {
      email: adminEmail,
      password: hashed,
      name: "Prachas Admin",
      role: "admin",
    },
  });
  console.log(`✔ Admin user ready: ${adminEmail} / ${adminPassword}`);

  // --- Blog posts ---------------------------------------------------------
  await prisma.blogPost.deleteMany();
  for (const post of BLOG_POSTS) {
    const { daysAgo, ...rest } = post;
    const publishedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
    await prisma.blogPost.create({
      data: { ...rest, publishedAt },
    });
  }
  console.log(`✔ Seeded ${BLOG_POSTS.length} blog posts`);

  // --- Services -----------------------------------------------------------
  await prisma.service.deleteMany();
  for (let i = 0; i < SERVICES.length; i++) {
    const s = SERVICES[i];
    await prisma.service.create({
      data: {
        slug: s.slug,
        title: s.title,
        shortDesc: s.shortDesc,
        longDesc: s.longDesc,
        benefits: JSON.stringify(s.benefits),
        industries: s.industries.join(", "),
        displayOrder: i,
      },
    });
  }
  console.log(`✔ Seeded ${SERVICES.length} services`);

  // --- Job postings -------------------------------------------------------
  const jobs = [
    {
      title: "Senior Java Developer",
      department: "Technology",
      location: "Hyderabad, India (Remote-friendly)",
      type: "full-time",
      description:
        "We're hiring a Senior Java Developer to build and maintain enterprise-grade services for our US clients. You'll design scalable backends, mentor mid-level engineers, and collaborate closely with US-based product teams across time zones.",
      requirements:
        "- 7+ years of Java/Spring Boot experience\n- Strong knowledge of REST APIs, microservices, and SQL\n- Experience with cloud platforms (AWS/Azure)\n- Excellent written and spoken English",
      salaryRange: "₹18–28 LPA",
      status: "active",
    },
    {
      title: "US IT Recruiter",
      department: "Recruiting",
      location: "Hyderabad, India (Night shift — US hours)",
      type: "full-time",
      description:
        "Join our recruiting team sourcing top technical talent for US clients. You'll manage the full recruiting lifecycle, from sourcing and screening to offer negotiation, working directly with US hiring managers.",
      requirements:
        "- 3+ years of US IT recruiting experience\n- Familiarity with W2, C2C, and 1099 engagements\n- Strong sourcing skills (LinkedIn, Dice, job boards)\n- Comfortable working US business hours",
      salaryRange: "₹6–12 LPA + incentives",
      status: "active",
    },
    {
      title: "Business Analyst",
      department: "Operations",
      location: "Hyderabad, India (Hybrid)",
      type: "contract",
      description:
        "We are looking for a Business Analyst to bridge business needs and technical delivery on client engagements. You'll gather requirements, document processes, and support delivery teams through the project lifecycle.",
      requirements:
        "- 4+ years as a Business Analyst\n- Strong requirements-gathering and documentation skills\n- Experience with Agile/Scrum\n- Excellent stakeholder communication",
      salaryRange: "₹10–16 LPA",
      status: "active",
    },
    {
      title: "HR Coordinator",
      department: "HR",
      location: "Hyderabad, India (On-site)",
      type: "full-time",
      description:
        "Support our growing team as an HR Coordinator, owning onboarding, employee records, and day-to-day HR operations. You'll be the friendly first point of contact for our people and help keep our culture strong.",
      requirements:
        "- 2+ years in an HR or people-operations role\n- Familiarity with HRIS and payroll basics\n- Strong organization and discretion\n- Warm, people-first communication style",
      salaryRange: "₹5–9 LPA",
      status: "active",
    },
  ];

  // Reset so re-seeding stays idempotent and applications don't accumulate.
  await prisma.application.deleteMany();
  await prisma.jobPosting.deleteMany();
  const createdJobs = [];
  for (const job of jobs) {
    createdJobs.push(await prisma.jobPosting.create({ data: job }));
  }
  console.log(`✔ Seeded ${jobs.length} job postings`);

  // --- Sample applications (one job-linked, one general) ------------------
  await prisma.application.createMany({
    data: [
      {
        jobId: createdJobs[0].id,
        name: "Arjun Reddy",
        email: "arjun.reddy@example.com",
        phone: "+91 98765 43210",
        department: "Technology",
        resumeUrl: "/uploads/sample-resume.pdf",
        coverNote:
          "10 years of Java and Spring Boot experience, most recently leading a payments backend. Excited about the US-client collaboration model.",
        status: "new",
      },
      {
        jobId: null,
        name: "Meera Iyer",
        email: "meera.iyer@example.com",
        phone: "+91 91234 56780",
        department: "Recruiting",
        resumeUrl: "/uploads/sample-resume.pdf",
        coverNote:
          "Open application — 5 years in US IT recruiting, looking to join a team with strong delivery culture.",
        status: "reviewed",
      },
    ],
  });
  console.log("✔ Seeded 2 sample applications");

  // --- Sample inquiries ---------------------------------------------------
  await prisma.inquiry.deleteMany();
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@acmehealth.com",
        company: "Acme Health Systems",
        phone: "+1 (415) 555-0134",
        serviceInterest: "Recruiting & Talent Acquisition",
        message:
          "We're scaling our nursing informatics team and need to fill 6 roles this quarter. Can we set up a call to discuss your recruiting process?",
        isRead: false,
      },
      {
        name: "David Chen",
        email: "dchen@brightpath.io",
        company: "BrightPath Software",
        phone: "+1 (206) 555-0177",
        serviceInterest: "IT Staffing",
        message:
          "Looking for 3 senior Java consultants for a 6-month engagement starting next month. What are your rates and availability?",
        isRead: true,
      },
    ],
  });
  console.log("✔ Seeded 2 inquiries");

  // --- Team members -------------------------------------------------------
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Ananya Rao",
        role: "Founder & CEO",
        bio: "Founded Prachas in 2013 with a vision to connect US businesses with India's best talent.",
        displayOrder: 1,
      },
      {
        name: "Vikram Nair",
        role: "VP, Delivery",
        bio: "Leads delivery across recruiting and BPO, obsessed with quality and SLAs.",
        displayOrder: 2,
      },
      {
        name: "Priya Sharma",
        role: "Head of Recruiting",
        bio: "Runs the US recruiting practice with a scorecard-driven, candidate-first approach.",
        displayOrder: 3,
      },
    ],
  });
  console.log("✔ Seeded 3 team members");

  // --- Site settings ------------------------------------------------------
  const settings: Record<string, string> = {
    companyPhone: "+91 40 4567 8900",
    companyEmail: "info@prachas.com",
    companyAddress: "HITEC City, Hyderabad, Telangana 500081, India",
    linkedinUrl: "https://www.linkedin.com/company/prachas-technologies",
    twitterUrl: "https://twitter.com/prachastech",
    businessHoursIST: "Mon–Fri, 9:30 AM – 6:30 PM IST",
    businessHoursEST: "Mon–Fri, 11:00 PM – 8:00 AM ET",
    notificationEmail: process.env.ADMIN_EMAIL || "admin@prachas.com",
    ccRecipients: "",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`✔ Seeded ${Object.keys(settings).length} site settings`);
}

main()
  .then(async () => {
    console.log("\n🌱 Seed complete.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
