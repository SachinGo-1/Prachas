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

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form submission" },
      { status: 400 }
    );
  }

  const fields = {
    jobId: params.id,
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

  // Ensure the job exists before accepting the application.
  const job = await prisma.jobPosting.findUnique({
    where: { id: params.id },
  });
  if (!job) {
    return NextResponse.json(
      { error: "This position is no longer available." },
      { status: 404 }
    );
  }

  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${randomUUID()}.pdf`;
    const bytes = Buffer.from(await resume.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), bytes);
    const resumeUrl = `/uploads/${filename}`;

    const department = parsed.data.department || job.department;

    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        department,
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
        subject: `New application: ${job.title} — ${parsed.data.name}`,
        html: applicationNotificationHtml({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone,
          jobTitle: job.title,
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
          jobTitle: job.title,
        }),
      });
    } catch (mailErr) {
      console.error("[jobs/apply] email failed:", mailErr);
    }

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (err) {
    console.error("[jobs/apply] failed:", err);
    return NextResponse.json(
      { error: "Could not submit your application. Please try again." },
      { status: 500 }
    );
  }
}
