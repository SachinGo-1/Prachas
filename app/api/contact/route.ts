import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";
import { sendEmail, inquiryNotificationHtml } from "@/lib/email";
import { getSettings } from "@/lib/settings";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        serviceInterest: data.serviceInterest,
        message: data.message,
      },
    });

    const settings = await getSettings();
    await sendEmail({
      to: settings.notificationEmail,
      cc: settings.ccRecipients || undefined,
      replyTo: data.email,
      subject: `New inquiry: ${data.serviceInterest} — ${data.name}`,
      html: inquiryNotificationHtml({ ...data, phone: data.phone || null }),
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error("[contact] failed:", err);
    return NextResponse.json(
      { error: "Could not submit your message. Please try again." },
      { status: 500 }
    );
  }
}
