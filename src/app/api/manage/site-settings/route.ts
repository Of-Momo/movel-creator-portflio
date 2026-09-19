import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const role = await getSessionRole();
  if (role !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid data." }, { status: 400 });
  }

  const { siteName, ownerName, role: businessRole, location, servicesSummary, defaultSeo } = body;

  await writeClient.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName,
    ownerName,
    role: businessRole,
    location,
    servicesSummary: Array.isArray(servicesSummary) ? servicesSummary : [],
    defaultSeo: defaultSeo || undefined,
  });

  return NextResponse.json({ ok: true });
}
