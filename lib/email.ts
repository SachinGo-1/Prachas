import nodemailer from "nodemailer";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

/**
 * Sends an email. When SMTP is not configured (common in local dev),
 * the message is logged to the console instead of throwing — so form
 * submissions still succeed end-to-end without credentials.
 */
export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const transport = getTransport();
  const from = process.env.SMTP_USER || "no-reply@prachas.com";

  if (!transport) {
    console.info(
      `[email] SMTP not configured — skipping send.\n  to: ${to}\n  subject: ${subject}`
    );
    return { delivered: false as const };
  }

  try {
    await transport.sendMail({ from, to, subject, html, replyTo });
    return { delivered: true as const };
  } catch (err) {
    // Never let a mail failure break the user-facing submission.
    console.error("[email] send failed:", err);
    return { delivered: false as const };
  }
}

export function inquiryNotificationHtml(data: {
  name: string;
  email: string;
  company?: string | null;
  serviceInterest: string;
  message: string;
}) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; color:#1A1A2E;">
      <h2 style="color:#1B3A6B;">New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Company:</strong> ${escapeHtml(data.company || "—")}</p>
      <p><strong>Service interest:</strong> ${escapeHtml(data.serviceInterest)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(data.message)}</p>
    </div>
  `;
}

export function applicationNotificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  coverNote?: string | null;
  resumeUrl: string;
}) {
  return `
    <div style="font-family: Inter, Arial, sans-serif; color:#1A1A2E;">
      <h2 style="color:#1B3A6B;">New Job Application</h2>
      <p><strong>Position:</strong> ${escapeHtml(data.jobTitle)}</p>
      <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Resume:</strong> ${escapeHtml(data.resumeUrl)}</p>
      <p><strong>Cover note:</strong></p>
      <p style="white-space:pre-wrap;">${escapeHtml(data.coverNote || "—")}</p>
    </div>
  `;
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
