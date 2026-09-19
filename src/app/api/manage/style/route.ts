import { NextRequest, NextResponse } from "next/server";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { HEADLINE_FONTS, BODY_FONTS, SIGNATURE_FONTS } from "@/lib/themeConstants";

export const runtime = "nodejs";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const COLOR_KEYS = ["paper", "ink", "accent", "soft", "detail"] as const;

function validateColors(colors: unknown): colors is Record<(typeof COLOR_KEYS)[number], { hex: string }> {
  if (!colors || typeof colors !== "object") return false;
  return COLOR_KEYS.every((k) => {
    const v = (colors as any)[k];
    return v && typeof v.hex === "string" && HEX_RE.test(v.hex);
  });
}

function validateFonts(fonts: unknown) {
  if (!fonts || typeof fonts !== "object") return false;
  const f = fonts as any;
  return HEADLINE_FONTS.includes(f.headline) && BODY_FONTS.includes(f.body) && SIGNATURE_FONTS.includes(f.signature);
}

export async function PUT(req: NextRequest) {
  const role = await getSessionRole();
  if (role !== "owner") {
    return NextResponse.json({ error: "Owner access required." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !validateColors(body.colors) || !validateFonts(body.fonts)) {
    return NextResponse.json({ error: "Invalid colors or fonts." }, { status: 400 });
  }
  if (body.presets !== undefined && !Array.isArray(body.presets)) {
    return NextResponse.json({ error: "Invalid presets." }, { status: 400 });
  }

  await writeClient.createOrReplace({
    _id: "siteStyle",
    _type: "siteStyle",
    colors: body.colors,
    fonts: body.fonts,
    presets: body.presets || [],
  });

  return NextResponse.json({ ok: true });
}
