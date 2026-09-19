"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import type { ContactSettings } from "@/lib/types";

const DEFAULT_LABELS = {
  name: "Name",
  brand: "Brand",
  contact: "Email or WhatsApp",
  service: "Service",
  videos: "How many videos",
  platforms: "Platforms",
  timeline: "Timeline",
  message: "Short message about the project",
  budget: "Budget in mind",
};

function buildWhatsAppMessage(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "—");
}

export function ContactForm({ settings }: { settings: ContactSettings | null }) {
  const labels = { ...DEFAULT_LABELS, ...(settings?.labels || {}) };
  const serviceOptions = settings?.serviceOptions?.length ? settings.serviceOptions : ["On camera", "Behind the camera", "Both"];
  const platformOptions = settings?.platformOptions?.length
    ? settings.platformOptions
    : ["Instagram", "TikTok", "YouTube", "LinkedIn", "Other"];

  const [values, setValues] = useState({
    name: "", brand: "", contact: "", service: serviceOptions[0] || "", videos: "",
    platforms: [] as string[], timeline: "", message: "", budget: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  const togglePlatform = (p: string) =>
    setValues((v) => ({
      ...v,
      platforms: v.platforms.includes(p) ? v.platforms.filter((x) => x !== p) : [...v.platforms, p],
    }));

  const requiredFilled = values.name && values.brand && values.contact && values.message;

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requiredFilled) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken: token }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error || "Something went wrong.");
      setStatus("sent");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Try WhatsApp instead?");
    }
  };

  const whatsappHref = () => {
    const template =
      settings?.whatsappTemplate ||
      "Hi Mo! New project enquiry from movelstudio.com\n\nName: {name}\nBrand: {brand}\nContact: {contact}\nService: {service}\nVideos: {videos}\nPlatforms: {platforms}\nTimeline: {timeline}\nBudget: {budget}\n\n{message}";
    const text = buildWhatsAppMessage(template, { ...values, platforms: values.platforms.join(", ") });
    const number = (settings?.whatsappNumber || "").replace(/[^\d]/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  };

  if (status === "sent") {
    return (
      <div className="rounded-lg bg-soft/50 p-8 text-center">
        <p className="font-headline text-2xl italic">{settings?.thankYou?.heading || "Got it. Your brief is in."}</p>
        <p className="mt-3 opacity-80">
          {settings?.thankYou?.body || "I'll get back to you within 48 hours. In the meantime, the feed's still running."}
        </p>
        <a href="/work" className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper">
          {settings?.thankYou?.buttonLabel || "Back to the work"}
        </a>
      </div>
    );
  }

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-4 py-3 text-sm outline-none focus:border-accent";

  return (
    <form onSubmit={handleEmailSend} className="grid max-w-xl gap-5">
      <Field label={labels.name} required>
        <input className={inputClass} value={values.name} onChange={(e) => set("name", e.target.value)} required />
      </Field>
      <Field label={labels.brand} required>
        <input className={inputClass} value={values.brand} onChange={(e) => set("brand", e.target.value)} required />
      </Field>
      <Field label={labels.contact} required>
        <input className={inputClass} value={values.contact} onChange={(e) => set("contact", e.target.value)} required />
      </Field>
      <Field label={labels.service} required>
        <select className={inputClass} value={values.service} onChange={(e) => set("service", e.target.value)}>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </Field>
      <Field label={labels.videos}>
        <input className={inputClass} value={values.videos} onChange={(e) => set("videos", e.target.value)} />
      </Field>
      <Field label={labels.platforms}>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => togglePlatform(p)}
              className={`rounded-full border px-4 py-1.5 text-sm ${
                values.platforms.includes(p) ? "border-accent bg-accent text-paper" : "border-detail/40"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </Field>
      <Field label={labels.timeline}>
        <input className={inputClass} value={values.timeline} onChange={(e) => set("timeline", e.target.value)} />
      </Field>
      <Field label={labels.message} required>
        <textarea className={inputClass} rows={4} value={values.message} onChange={(e) => set("message", e.target.value)} required />
      </Field>
      <Field label={`${labels.budget} (optional)`}>
        <input className={inputClass} value={values.budget} onChange={(e) => set("budget", e.target.value)} />
      </Field>

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setToken}
          options={{ size: "invisible" }}
        />
      )}

      {errorMsg && <p className="text-sm text-accent">{errorMsg}</p>}

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!requiredFilled || status === "sending"}
          className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Send by email"}
        </button>
        <a
          href={requiredFilled ? whatsappHref() : undefined}
          aria-disabled={!requiredFilled}
          target="_blank"
          rel="noopener noreferrer"
          className={`rounded-full border border-accent px-8 py-3 text-center text-sm uppercase tracking-[0.15em] text-accent ${
            !requiredFilled ? "pointer-events-none opacity-40" : ""
          }`}
        >
          Send on WhatsApp
        </a>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm uppercase tracking-[0.08em] opacity-80">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
