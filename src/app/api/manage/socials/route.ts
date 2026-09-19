import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

async function requireOwner() {
  const role = await getSessionRole();
  return role === "owner";
}

export async function POST(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);
  if (!body?.platform || !body?.url) {
    return NextResponse.json({ error: "Platform and URL are required." }, { status: 400 });
  }
  const maxOrder = await writeClient.fetch<number | null>(`*[_type == "social"] | order(order desc)[0].order`);
  const doc = await writeClient.create({
    _type: "social",
    platform: body.platform,
    handle: body.handle || "",
    url: body.url,
    order: (maxOrder ?? -1) + 1,
  });
  return NextResponse.json({ ok: true, _id: doc._id });
}

export async function PUT(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);

  if (Array.isArray(body?.order)) {
    const tx = writeClient.transaction();
    body.order.forEach((id: string, index: number) => {
      tx.patch(id, { set: { order: index } });
    });
    await tx.commit();
    return NextResponse.json({ ok: true });
  }

  if (!body?._id) return NextResponse.json({ error: "Missing _id." }, { status: 400 });

  await writeClient
    .patch(body._id)
    .set({ platform: body.platform, handle: body.handle || "", url: body.url })
    .commit();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await writeClient.delete(id);
  return NextResponse.json({ ok: true });
}
