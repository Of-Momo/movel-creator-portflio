"use client";

import { useState } from "react";
import { StringListField } from "./fields/StringListField";
import type { ContactSettings } from "@/lib/types";

const LABEL_KEYS: { key: string; title: string }[] = [
  { key: "name", title: "Name field label" },
  { key: "brand", title: "Brand field label" },
  { key: "contact", title: "Email/WhatsApp field label" },
  { key: "service", title: "Service field label" },
  { key: "videos", title: "Videos field label" },
  { key: "platforms", title: "Platforms field label" },
  { key: "timeline", title: "Timeline field label" },
  { key: "message", title: "Message field label" },
  { key: "budget", title: "Budget field label" },
];

export function ContactSettingsEditor({ initial }: { initial: ContactSettings }) {
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber || "");
  const [email, setEmail] = useState(initial.email || "");
  const [responseTimeHours, setResponseTimeHours] = useState(initial.responseTimeHours ?? 48);
  const [labels, setLabels] = useState<Record<string, string>>(initial.labels || {});
  const [serviceOptions, setServiceOptions] = useState(initial.serviceOptions || []);
  const [platformOptions, setPlatformOptions] = useState(initial.platformOptions || []);
  const [autoReplySubject, setAutoReplySubject] = useState(initial.autoReply?.subject || "");
  const [autoReplyBody, setAutoReplyBody] = useState(initial.autoReply?.body || "");
  const [notifySubjectTemplate, setNotifySubjectTemplate] = useState(initial.notifySubjectTemplate || "");
  const [thankYouHeading, setThankYouHeading] = useState(initial.thankYou?.heading || "");
  const [thankYouBody, setThankYouBody] = useState(initial.thankYou?.body || "");
  const [thankYouButtonLabel, setThankYouButtonLabel] = useState(initial.thankYou?.buttonLabel || "");
  const [whatsappTemplate, setWhatsappTemplate] = useState(initial.whatsappTemplate || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/manage/contact-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber,
          email,
          responseTimeHours: Number(responseTimeHours) || 0,
          labels,
          serviceOptions,
          platformOptions,
          autoReply: { subject: autoReplySubject, body: autoReplyBody },
          notifySubjectTemplate,
          thankYou: { heading: thankYouHeading, body: thankYouBody, buttonLabel: thankYouButtonLabel },
          whatsappTemplate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage({ type: "ok", text: "Saved." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-xl italic">Contact details</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Business WhatsApp number (with country code, no spaces)</span>
          <input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className={inputClass} placeholder="+2348012345678" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Contact email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Promised response time (hours)</span>
          <input
            type="number"
            value={responseTimeHours}
            onChange={(e) => setResponseTimeHours(Number(e.target.value))}
            className={inputClass}
          />
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-headline text-xl italic">Field labels</h2>
        {LABEL_KEYS.map(({ key, title }) => (
          <label key={key} className="flex flex-col gap-1 text-sm">
            <span className="opacity-70">{title}</span>
            <input
              value={labels[key] || ""}
              onChange={(e) => setLabels((l) => ({ ...l, [key]: e.target.value }))}
              className={inputClass}
            />
          </label>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-xl italic">Form options</h2>
        <StringListField label="Service options" values={serviceOptions} onChange={setServiceOptions} />
        <StringListField label="Platform options" values={platformOptions} onChange={setPlatformOptions} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-xl italic">Auto-reply email to the brand</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Subject</span>
          <input value={autoReplySubject} onChange={(e) => setAutoReplySubject(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Body</span>
          <textarea rows={6} value={autoReplyBody} onChange={(e) => setAutoReplyBody(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Notification email subject (to Mo) — use {"{brand}"} and {"{service}"}</span>
          <input value={notifySubjectTemplate} onChange={(e) => setNotifySubjectTemplate(e.target.value)} className={inputClass} />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-xl italic">Thank-you screen</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Heading</span>
          <input value={thankYouHeading} onChange={(e) => setThankYouHeading(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Body</span>
          <textarea rows={3} value={thankYouBody} onChange={(e) => setThankYouBody(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Button label</span>
          <input value={thankYouButtonLabel} onChange={(e) => setThankYouButtonLabel(e.target.value)} className={inputClass} />
        </label>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-headline text-xl italic">WhatsApp pre-filled message template</h2>
        <p className="text-xs opacity-60">
          Placeholders: {"{name} {brand} {contact} {service} {videos} {platforms} {timeline} {budget} {message}"}
        </p>
        <textarea rows={10} value={whatsappTemplate} onChange={(e) => setWhatsappTemplate(e.target.value)} className={inputClass} />
      </section>

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {message && (
          <span className={`text-sm ${message.type === "error" ? "text-accent" : "opacity-70"}`}>{message.text}</span>
        )}
      </div>
    </div>
  );
}
