import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  // --- Job postings -------------------------------------------------------
  const jobs = [
    {
      title: "Senior Java Developer",
      department: "IT Staffing",
      location: "Hyderabad, India (Remote-friendly)",
      type: "full-time",
      description:
        "We're hiring a Senior Java Developer to build and maintain enterprise-grade services for our US clients. You'll design scalable backends, mentor mid-level engineers, and collaborate closely with US-based product teams across time zones.",
      requirements:
        "7+ years of Java/Spring Boot experience.\nStrong knowledge of REST APIs, microservices, and SQL.\nExperience with cloud platforms (AWS/Azure).\nExcellent written and spoken English.",
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
        "3+ years of US IT recruiting experience.\nFamiliarity with W2, C2C, and 1099 engagements.\nStrong sourcing skills (LinkedIn, Dice, job boards).\nComfortable working US business hours.",
      salaryRange: "₹6–12 LPA + incentives",
      status: "active",
    },
    {
      title: "Business Analyst",
      department: "Consulting",
      location: "Hyderabad, India (Hybrid)",
      type: "contract",
      description:
        "We are looking for a Business Analyst to bridge business needs and technical delivery on client engagements. You'll gather requirements, document processes, and support delivery teams through the project lifecycle.",
      requirements:
        "4+ years as a Business Analyst.\nStrong requirements-gathering and documentation skills.\nExperience with Agile/Scrum.\nExcellent stakeholder communication.",
      salaryRange: "₹10–16 LPA",
      status: "active",
    },
  ];

  // Reset job postings so re-seeding stays idempotent and applications
  // don't accumulate orphaned rows across runs.
  await prisma.application.deleteMany();
  await prisma.jobPosting.deleteMany();
  for (const job of jobs) {
    await prisma.jobPosting.create({ data: job });
  }
  console.log(`✔ Seeded ${jobs.length} job postings`);

  // --- Sample inquiries ---------------------------------------------------
  await prisma.inquiry.deleteMany();
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@acmehealth.com",
        company: "Acme Health Systems",
        serviceInterest: "Recruiting & Talent Acquisition",
        message:
          "We're scaling our nursing informatics team and need to fill 6 roles this quarter. Can we set up a call to discuss your recruiting process?",
        isRead: false,
      },
      {
        name: "David Chen",
        email: "dchen@brightpath.io",
        company: "BrightPath Software",
        serviceInterest: "IT Staffing & Consulting",
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
      { name: "Ananya Rao", role: "Founder & CEO", bio: "Founded Prachas in 2013 with a vision to connect US businesses with India's best talent.", displayOrder: 1 },
      { name: "Vikram Nair", role: "VP, Delivery", bio: "Leads delivery across recruiting and BPO, obsessed with quality and SLAs.", displayOrder: 2 },
      { name: "Priya Sharma", role: "Head of Recruiting", bio: "Runs the US recruiting practice with a scorecard-driven, candidate-first approach.", displayOrder: 3 },
      { name: "Rahul Menon", role: "Director, IT Staffing", bio: "Builds and manages the consultant bench across modern enterprise stacks.", displayOrder: 4 },
    ],
  });
  console.log("✔ Seeded 4 team members");

  // --- Site settings ------------------------------------------------------
  const settings: Record<string, string> = {
    companyPhone: "+91 40 1234 5678",
    companyEmail: "info@prachas.com",
    companyAddress: "HITEC City, Hyderabad, Telangana 500081, India",
    linkedinUrl: "https://www.linkedin.com/company/prachas-technologies",
    twitterUrl: "https://twitter.com/prachastech",
    businessHoursIST: "Mon–Fri, 9:30 AM – 6:30 PM IST",
    businessHoursEST: "Mon–Fri, 11:00 PM – 8:00 AM EST",
    notificationEmail: process.env.ADMIN_EMAIL || "admin@prachas.com",
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
