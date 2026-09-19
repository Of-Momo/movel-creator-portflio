import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export type PostRole = "owner" | "assistant";

const COOKIE_NAME = "movel_post_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.POST_SESSION_SECRET;
  if (!s) throw new Error("POST_SESSION_SECRET is not set — see SETUP.md.");
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPasscode(passcode: string): PostRole | null {
  const owner = process.env.OWNER_PASSCODE;
  const assistant = process.env.ASSISTANT_PASSCODE;
  if (owner && safeEqual(passcode, owner)) return "owner";
  if (assistant && safeEqual(passcode, assistant)) return "assistant";
  return null;
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function createSession(role: PostRole) {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `${role}.${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionRole(): Promise<PostRole | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return token ? parseToken(token) : null;
}

export function getSessionRoleFromCookieHeader(cookieHeader: string | null): PostRole | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? parseToken(decodeURIComponent(match[1])) : null;
}

function parseToken(token: string): PostRole | null {
  const [role, expiresStr, signature] = token.split(".");
  if (!role || !expiresStr || !signature) return null;
  const payload = `${role}.${expiresStr}`;
  if (!safeEqual(sign(payload), signature)) return null;
  if (Date.now() > Number(expiresStr)) return null;
  return role === "owner" || role === "assistant" ? role : null;
}
