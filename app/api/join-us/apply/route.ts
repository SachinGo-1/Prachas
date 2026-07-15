import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";
import {
  sendEmail,
  applicationNotificationHtml,
  applicantConfirmationHtml,
} from "@/lib/email";
import { getNotificationEmail } from "@/lib/settings";

export const runtime = "nodejs";

const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form submission" },
      { status: 400 }
    );
  }

  const rawJobId = String(form.get("jobId") || "");

  const fields = {
    jobId: rawJobId,
    name: String(form.get("name") || ""),
    email: String(form.get("email") || ""),
    phone: String(form.get("phone") || ""),
    department: String(form.get("department") || ""),
    coverNote: String(form.get("coverNote") || ""),
  };

  const parsed = applicationSchema.safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const resume = form.get("resume");
  if (!(resume instanceof File) || resume.size === 0) {
    return NextResponse.json(
      { error: "A resume file is required." },
      { status: 400 }
    );
  }
  if (resume.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Resume must be a PDF file." },
      { status: 400 }
    );
  }
  if (resume.size > MAX_RESUME_BYTES) {
    return NextResponse.json(
      { error: "Resume must be smaller than 5MB." },
      { status: 400 }
    );
  }

  // Optional job target: verify it exists and derive its details when set.
  let jobId: string | null = null;
  let jobTitle = "General Application";
  let department = parsed.data.department || "";

  if (rawJobId) {
    const job = await prisma.jobPosting.findUnique({
      where: { id: rawJobId },
    });
    if (!job) {
      return NextResponse.json(
        { error: "This position is no longer available." },
        { status: 404 }
      );
    }
    jobId = job.id;
    jobTitle = job.title;
    department = parsed.data.department || job.department;
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}.pdf`;
    const bytes = Buffer.from(await resume.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), bytes);
    const resumeUrl = `/uploads/${filename}`;

    const application = await prisma.application.create({
      data: {
        jobId,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        department: department || null,
        coverNote: parsed.data.coverNote || null,
        resumeUrl,
      },
    });

    // Notifications must never break the submission response.
    try {
      const to = await getNotificationEmail();
      await sendEmail({
        to,
        replyTo: parsed.data.email,
        subject: `New application: ${jobTitle} — ${parsed.data.name}`,
        html: applicationNotificationHtml({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          jobTitle,
          department,
          coverNote: parsed.data.coverNote,
          resumeUrl,
        }),
      });
      await sendEmail({
        to: parsed.data.email,
        subject: "We received your application — Prachas Technologies",
        html: applicantConfirmationHtml({
          name: parsed.data.name,
          jobTitle,
        }),
      });
    } catch (mailErr) {
      console.error("[join-us/apply] email failed:", mailErr);
    }

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error("[join-us/apply] failed:", err);
    return NextResponse.json(
      { error: "Could not submit your application. Please try again." },
      { status: 500 }
    );
  }
}
