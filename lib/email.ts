import nodemailer from "nodemailer";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string;
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
    // Fail fast on an unreachable/misconfigured SMTP host so form
    // submissions never hang waiting on a dead connection.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

/**
 * Sends an email. When SMTP is not configured (common in local dev),
 * the message is logged to the console instead of throwing — so form
 * submissions still succeed end-to-end without credentials.
 */
export async function sendEmail({ to, subject, html, replyTo, cc }: SendArgs) {
  const transport = getTransport();
  const from = process.env.SMTP_USER || "no-reply@prachas.com";

  if (!transport) {
    console.info(
      `[email] SMTP not configured — skipping send.\n  to: ${to}\n  subject: ${subject}`
    );
    return { delivered: false as const };
  }

  try {
    await transport.sendMail({ from, to, subject, html, replyTo, cc });
    return { delivered: true as const };
  } catch (err) {
    // Never let a mail failure break the user-facing submission.
    console.error("[email] send failed:", err);
    return { delivered: false as const };
  }
}

/* -------------------------------------------------------------------------- */
/* HTML templates — dark charcoal + lime green, matching the brand.            */
/* -------------------------------------------------------------------------- */

const BG = "#111111";
const CARD = "#1a1a1a";
const ACCENT = "#00e676";
const TEXT = "#f0f0f0";
const MUTED = "#888888";
const BORDER = "#2a2a2a";

function shell(title: string, inner: string) {
  return `
  <div style="background:${BG};padding:32px 0;font-family:Inter,Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:${CARD};border:1px solid ${BORDER};border-radius:12px;overflow:hidden;">
      <div style="border-top:3px solid ${ACCENT};padding:28px 32px 8px;">
        <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};">Prachas Technologies</p>
        <h1 style="margin:8px 0 0;font-size:20px;color:${TEXT};">${escapeHtml(title)}</h1>
      </div>
      <div style="padding:8px 32px 28px;color:${TEXT};font-size:14px;line-height:1.7;">
        ${inner}
      </div>
      <div style="padding:16px 32px;border-top:1px solid ${BORDER};color:${MUTED};font-size:12px;">
        Sent automatically by prachas.com
      </div>
    </div>
  </div>`;
}

function row(label: string, value: string) {
  return `<p style="margin:6px 0;"><span style="color:${MUTED};">${escapeHtml(
    label
  )}:</span> <span style="color:${TEXT};">${escapeHtml(value)}</span></p>`;
}

export function inquiryNotificationHtml(data: {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  serviceInterest: string;
  message: string;
}) {
  return shell(
    "New Contact Inquiry",
    `
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${row("Company", data.company || "—")}
    ${row("Phone", data.phone || "—")}
    ${row("Service interest", data.serviceInterest)}
    <p style="margin:16px 0 4px;color:${MUTED};">Message</p>
    <p style="white-space:pre-wrap;margin:0;color:${TEXT};">${escapeHtml(
      data.message
    )}</p>
    `
  );
}

export function applicationNotificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  department?: string | null;
  coverNote?: string | null;
  resumeUrl: string;
}) {
  return shell(
    "New Job Application",
    `
    ${row("Position", data.jobTitle)}
    ${row("Department", data.department || "—")}
    ${row("Name", data.name)}
    ${row("Email", data.email)}
    ${row("Phone", data.phone)}
    ${row("Resume", data.resumeUrl)}
    <p style="margin:16px 0 4px;color:${MUTED};">Cover note</p>
    <p style="white-space:pre-wrap;margin:0;color:${TEXT};">${escapeHtml(
      data.coverNote || "—"
    )}</p>
    `
  );
}

export function applicantConfirmationHtml(data: {
  name: string;
  jobTitle: string;
}) {
  return shell(
    "We received your application",
    `
    <p style="margin:0 0 12px;">Hi ${escapeHtml(data.name)},</p>
    <p style="margin:0 0 12px;">Thank you for applying for <strong style="color:${ACCENT};">${escapeHtml(
      data.jobTitle
    )}</strong> at Prachas Technologies. Our talent team has received your application and will review it shortly.</p>
    <p style="margin:0 0 12px;">If your background is a match, we'll reach out to schedule a conversation. Either way, we appreciate your interest in joining us.</p>
    <p style="margin:16px 0 0;color:${MUTED};">— The Prachas Talent Team</p>
    `
  );
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
