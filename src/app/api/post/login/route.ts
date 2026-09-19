import { NextRequest, NextResponse } from "next/server";
import { checkPasscode, createSession } from "@/lib/postSession";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json().catch(() => ({ passcode: "" }));
  if (typeof passcode !== "string" || !passcode) {
    return NextResponse.json({ error: "Enter a passcode." }, { status: 400 });
  }
  const role = checkPasscode(passcode);
  if (!role) {
    return NextResponse.json({ error: "That passcode isn't right." }, { status: 401 });
  }
  await createSession(role);
  return NextResponse.json({ ok: true, role });
}
