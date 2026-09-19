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
  if (!body?.question || !body?.answer) {
    return NextResponse.json({ error: "Question and answer are required." }, { status: 400 });
  }
  const maxOrder = await writeClient.fetch<number | null>(`*[_type == "faq"] | order(order desc)[0].order`);
  const doc = await writeClient.create({
    _type: "faq",
    question: body.question,
    answer: body.answer,
    showOnHomepage: Boolean(body.showOnHomepage),
    showOnAbout: body.showOnAbout !== false,
    order: (maxOrder ?? -1) + 1,
  });
  return NextResponse.json({ ok: true, _id: doc._id });
}

export async function PUT(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);

  if (Array.isArray(body?.order)) {
    const tx = writeClient.transaction();
    body.order.forEach((id: string, index: number) => tx.patch(id, { set: { order: index } }));
    await tx.commit();
    return NextResponse.json({ ok: true });
  }

  if (!body?._id) return NextResponse.json({ error: "Missing _id." }, { status: 400 });
  await writeClient
    .patch(body._id)
    .set({
      question: body.question,
      answer: body.answer,
      showOnHomepage: Boolean(body.showOnHomepage),
      showOnAbout: Boolean(body.showOnAbout),
    })
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
