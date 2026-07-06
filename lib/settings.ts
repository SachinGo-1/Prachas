import { prisma } from "@/lib/prisma";
import { SITE } from "@/lib/constants";

export const DEFAULT_SETTINGS = {
  companyPhone: SITE.phone,
  companyEmail: SITE.email,
  companyAddress: SITE.addressLines.join(", "),
  linkedinUrl: SITE.linkedin,
  twitterUrl: "",
  businessHoursIST: "Mon–Fri, 9:30 AM – 6:30 PM IST",
  businessHoursEST: "Mon–Fri, 11:00 PM – 8:00 AM EST",
  notificationEmail: process.env.ADMIN_EMAIL || "admin@prachas.com",
};

export type SettingsMap = typeof DEFAULT_SETTINGS;

/** Fetch all site settings as a map, merged over sensible defaults. */
export async function getSettings(): Promise<SettingsMap> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map as SettingsMap;
}

/** Resolve the admin notification email (settings → env → fallback). */
export async function getNotificationEmail(): Promise<string> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: "notificationEmail" },
  });
  return (
    row?.value || process.env.ADMIN_EMAIL || "admin@prachas.com"
  );
}
