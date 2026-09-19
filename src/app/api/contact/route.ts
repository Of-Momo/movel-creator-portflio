import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { client } from "@/sanity/lib/client";
import { contactSettingsQuery } from "@/sanity/lib/queries";

export const runtime = "nodejs";

async function verifyTurnstile(token: string | null, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured yet — don't block Mo's local testing
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip || undefined }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

function fillTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "—");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, brand, contact, service, videos, platforms, timeline, message, budget, turnstileToken } = body;

    if (!name || !brand || !contact || !message) {
      return NextResponse.json({ error: "Please fill in every required field." }, { status: 400 });
    }

    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for");
    const human = await verifyTurnstile(turnstileToken, ip);
    if (!human) {
      return NextResponse.json({ error: "Spam check failed. Please try again." }, { status: 400 });
    }

    const settings = await client.fetch(contactSettingsQuery);
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email isn't set up yet — try WhatsApp instead, or see SETUP.md to connect Resend." },
        { status: 503 }
      );
    }
    const resend = new Resend(apiKey);
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "MOVEL <onboarding@resend.dev>";
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || settings?.email;

    const values = {
      name, brand, contact, service, videos: videos || "", platforms: (platforms || []).join(", "),
      timeline: timeline || "", budget: budget || "", message,
    };

    const notifySubject = fillTemplate(settings?.notifySubjectTemplate || "New enquiry: {brand} ({service})", values);
    const notifyBody = `
      <h2>New enquiry from movelstudio.com</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Brand:</strong> ${brand}</p>
      <p><strong>Contact:</strong> ${contact}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Videos:</strong> ${videos || "—"}</p>
      <p><strong>Platforms:</strong> ${values.platforms || "—"}</p>
      <p><strong>Timeline:</strong> ${timeline || "—"}</p>
      <p><strong>Budget:</strong> ${budget || "—"}</p>
      <p><strong>Message:</strong><br/>${String(message).replace(/\n/g, "<br/>")}</p>
    `;

    const autoReplySubject = settings?.autoReply?.subject || "Got it. Your brief is with Mo.";
    const autoReplyBodyTemplate =
      settings?.autoReply?.body ||
      "Hi {name},\n\nThanks for reaching out about {brand}. Your brief is in, and I'll get back to you within 48 hours with next steps and a quote.\n\nWhile you wait, the feed's still running: movelstudio.com/work\n\nMo\nMOVEL · movelstudio.com";
    const autoReplyBody = fillTemplate(autoReplyBodyTemplate, values).replace(/\n/g, "<br/>");

    if (notifyTo) {
      await resend.emails.send({ from: fromEmail, to: notifyTo, subject: notifySubject, html: notifyBody });
    }

    if (contact.includes("@")) {
      await resend.emails.send({ from: fromEmail, to: contact, subject: autoReplySubject, html: autoReplyBody });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try WhatsApp instead." }, { status: 500 });
  }
}
