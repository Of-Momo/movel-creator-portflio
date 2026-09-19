import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

async function requireOwner() {
  return (await getSessionRole()) === "owner";
}

export async function POST(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  const doc = await writeClient.create({
    _type: "brand",
    name: body.name,
    showOnSite: body.showOnSite !== false,
    isPlaceholder: false,
    logo: body.logoAssetRef
      ? { _type: "image", asset: { _type: "reference", _ref: body.logoAssetRef } }
      : undefined,
  });
  return NextResponse.json({ ok: true, _id: doc._id });
}

export async function PUT(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?._id) return NextResponse.json({ error: "Missing _id." }, { status: 400 });

  const set: Record<string, unknown> = { name: body.name, showOnSite: Boolean(body.showOnSite) };
  if (body.logoAssetRef) {
    set.logo = { _type: "image", asset: { _type: "reference", _ref: body.logoAssetRef } };
  }
  await writeClient.patch(body._id).set(set).commit();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await writeClient.delete(id);
  return NextResponse.json({ ok: true });
}
