import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

const PAGE_TYPES = new Set(["homePage", "aboutPage", "workPage", "contactPage"]);

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!PAGE_TYPES.has(type)) {
    return NextResponse.json({ error: "Unknown page." }, { status: 400 });
  }
  const role = await getSessionRole();
  if (role !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.sections)) {
    return NextResponse.json({ error: "Invalid sections." }, { status: 400 });
  }

  const doc: Record<string, unknown> = {
    _id: type,
    _type: type,
    sections: body.sections,
    seo: body.seo || undefined,
  };
  if (type === "workPage") {
    doc.heading = body.heading;
    doc.subline = body.subline;
  }

  await writeClient.createOrReplace(doc as any);
  return NextResponse.json({ ok: true });
}
