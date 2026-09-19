import { NextResponse } from "next/server";
import { clearSession } from "@/lib/postSession";

export const runtime = "nodejs";

export async function POST() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
