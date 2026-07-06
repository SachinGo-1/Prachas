import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { getSettings, DEFAULT_SETTINGS } from "@/lib/settings";

export async function GET() {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const settings = await getSettings();
  return NextResponse.json({ settings });
}

// Only allow known setting keys to be written.
const settingsSchema = z
  .object(
    Object.fromEntries(
      Object.keys(DEFAULT_SETTINGS).map((k) => [k, z.string().max(500)])
    ) as Record<keyof typeof DEFAULT_SETTINGS, z.ZodString>
  )
  .partial();

export async function PUT(req: Request) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const entries = Object.entries(parsed.data) as [string, string][];
  await Promise.all(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}
