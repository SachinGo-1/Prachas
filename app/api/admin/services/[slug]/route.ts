import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { serviceSchema } from "@/lib/validations";

type Params = { params: { slug: string } };

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const service = await prisma.service.findUnique({
    where: { slug: params.slug },
  });
  if (!service) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ service });
}

export async function PUT(req: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { title, shortDesc, longDesc, benefits, industries, displayOrder } =
    parsed.data;

  try {
    const service = await prisma.service.update({
      where: { slug: params.slug },
      data: {
        title,
        shortDesc,
        longDesc,
        benefits: JSON.stringify(benefits.filter((b) => b.trim())),
        industries: industries
          .map((i) => i.trim())
          .filter(Boolean)
          .join(", "),
        ...(displayOrder !== undefined ? { displayOrder } : {}),
      },
    });
    return NextResponse.json({ service });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
