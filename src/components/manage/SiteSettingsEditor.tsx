"use client";

import { useState } from "react";
import { StringListField } from "./fields/StringListField";
import { MediaUploadField } from "./fields/MediaUploadField";
import type { SiteSettings } from "@/lib/types";

export function SiteSettingsEditor({ initial }: { initial: SiteSettings }) {
  const [siteName, setSiteName] = useState(initial.siteName || "");
  const [ownerName, setOwnerName] = useState(initial.ownerName || "");
  const [role, setRole] = useState(initial.role || "");
  const [location, setLocation] = useState(initial.location || "");
  const [servicesSummary, setServicesSummary] = useState(initial.servicesSummary || []);
  const [seoTitle, setSeoTitle] = useState(initial.defaultSeo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initial.defaultSeo?.description || "");
  const [shareImageRef, setShareImageRef] = useState(initial.defaultSeo?.shareImage?.asset?._ref);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/manage/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          ownerName,
          role,
          location,
          servicesSummary,
          defaultSeo: {
            title: seoTitle,
            description: seoDescription,
            shareImage: shareImageRef
              ? { _type: "image", asset: { _type: "reference", _ref: shareImageRef } }
              : undefined,
          },
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
        <h2 className="font-headline text-xl italic">Business info</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Site name</span>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Owner&rsquo;s name</span>
          <input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Role</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </label>
        <StringListField
          label="Services summary (for AI + structured data)"
          values={servicesSummary}
          onChange={setServicesSummary}
          multiline
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-headline text-xl italic">Default SEO + sharing</h2>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Page title</span>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="opacity-70">Description</span>
          <textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
        </label>
        <MediaUploadField
          label="Share image"
          kind="image"
          currentAssetRef={shareImageRef}
          onUploaded={(ref) => setShareImageRef(ref)}
        />
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
