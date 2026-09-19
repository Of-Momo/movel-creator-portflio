import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { writeClient } from "@/sanity/lib/client";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const asset = await writeClient.assets.upload(isImage ? "image" : "file", buffer, {
      filename: file.name,
      contentType: file.type,
    });
    return NextResponse.json({ assetRef: asset._id });
  } catch (err) {
    console.error("Asset upload failed:", err);
    return NextResponse.json({ error: "Upload to Sanity failed. Check your connection and try again." }, { status: 500 });
  }
}
