import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/client";
import { rankBefore } from "@/lib/orderRank";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const role = (session.user as any).role as "owner" | "assistant";

  const body = await req.json();
  const {
    videoAssetRef, brandId, newBrandName, caption, reasoningVideoAssetRef,
    thumbnailAssetRef, showOnHomepage, orientation,
  } = body;

  if (!videoAssetRef || !caption || !thumbnailAssetRef || (!brandId && !newBrandName)) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    let brandRef = brandId;
    if (!brandRef && newBrandName) {
      const brandDoc = await writeClient.create({
        _type: "brand",
        name: newBrandName,
        showOnSite: true,
      });
      brandRef = brandDoc._id;
    }

    const [topRank, maxNumber] = await Promise.all([
      writeClient.fetch<string | null>(`*[_type == "project"] | order(orderRank asc)[0].orderRank`),
      writeClient.fetch<number | null>(`*[_type == "project"] | order(number desc)[0].number`),
    ]);

    const number = (maxNumber || 0) + 1;
    const slug = `project-${number}-${Date.now().toString(36)}`;

    const doc = {
      _type: "project",
      _id: role === "assistant" ? `drafts.project-${Date.now()}` : undefined,
      orderRank: rankBefore(topRank),
      number,
      slug: { _type: "slug", current: slug },
      brand: { _type: "reference", _ref: brandRef },
      caption,
      thumbnail: { _type: "image", asset: { _type: "reference", _ref: thumbnailAssetRef } },
      video: { _type: "file", asset: { _type: "reference", _ref: videoAssetRef } },
      ...(reasoningVideoAssetRef
        ? { reasoningVideo: { _type: "file", asset: { _type: "reference", _ref: reasoningVideoAssetRef } } }
        : {}),
      showOnHomepage: Boolean(showOnHomepage),
      orientation: orientation || "vertical",
      isPlaceholder: false,
    };

    const created = await writeClient.create(doc);
    return NextResponse.json({ ok: true, id: created._id, draft: role === "assistant" });
  } catch (err) {
    console.error("Publish failed:", err);
    return NextResponse.json({ error: "Publishing failed. Please try again." }, { status: 500 });
  }
}
