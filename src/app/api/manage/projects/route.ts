import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { rankBefore } from "@/lib/orderRank";

export const runtime = "nodejs";

async function requireOwner() {
  return (await getSessionRole()) === "owner";
}

export async function POST(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const { videoAssetRef, brandId, caption, thumbnailAssetRef, reasoningVideoAssetRef, showOnHomepage, orientation } =
    body || {};

  if (!videoAssetRef || !caption || !thumbnailAssetRef || !brandId) {
    return NextResponse.json({ error: "Video, thumbnail, brand and caption are required." }, { status: 400 });
  }

  const [topRank, maxNumber] = await Promise.all([
    writeClient.fetch<string | null>(`*[_type == "project"] | order(orderRank asc)[0].orderRank`),
    writeClient.fetch<number | null>(`*[_type == "project"] | order(number desc)[0].number`),
  ]);
  const number = (maxNumber || 0) + 1;
  const slug = `project-${number}-${Date.now().toString(36)}`;

  const doc = await writeClient.create({
    _type: "project",
    orderRank: rankBefore(topRank),
    number,
    slug: { _type: "slug", current: slug },
    brand: { _type: "reference", _ref: brandId },
    caption,
    video: { _type: "file", asset: { _type: "reference", _ref: videoAssetRef } },
    thumbnail: { _type: "image", asset: { _type: "reference", _ref: thumbnailAssetRef } },
    reasoningVideo: reasoningVideoAssetRef
      ? { _type: "file", asset: { _type: "reference", _ref: reasoningVideoAssetRef } }
      : undefined,
    showOnHomepage: Boolean(showOnHomepage),
    orientation: orientation === "horizontal" ? "horizontal" : "vertical",
    isPlaceholder: false,
  });

  return NextResponse.json({ ok: true, _id: doc._id });
}

export async function PUT(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  const body = await req.json().catch(() => null);

  if (body?.swapRanks) {
    const [aId, bId] = body.swapRanks as [string, string];
    const [aRank, bRank] = await Promise.all([
      writeClient.fetch<string>(`*[_id == $id][0].orderRank`, { id: aId }),
      writeClient.fetch<string>(`*[_id == $id][0].orderRank`, { id: bId }),
    ]);
    await writeClient
      .transaction()
      .patch(aId, { set: { orderRank: bRank } })
      .patch(bId, { set: { orderRank: aRank } })
      .commit();
    return NextResponse.json({ ok: true });
  }

  if (!body?._id) return NextResponse.json({ error: "Missing _id." }, { status: 400 });

  const set: Record<string, unknown> = {
    caption: body.caption,
    brand: { _type: "reference", _ref: body.brandId },
    showOnHomepage: Boolean(body.showOnHomepage),
    orientation: body.orientation === "horizontal" ? "horizontal" : "vertical",
  };
  if (body.videoAssetRef) set.video = { _type: "file", asset: { _type: "reference", _ref: body.videoAssetRef } };
  if (body.thumbnailAssetRef) set.thumbnail = { _type: "image", asset: { _type: "reference", _ref: body.thumbnailAssetRef } };
  if (body.reasoningVideoAssetRef) {
    set.reasoningVideo = { _type: "file", asset: { _type: "reference", _ref: body.reasoningVideoAssetRef } };
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
