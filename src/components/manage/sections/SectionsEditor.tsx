"use client";

import { useState } from "react";
import { SECTION_TYPES, SECTION_LABELS, defaultSectionFor, type SectionType } from "@/lib/sectionTypes";
import { SectionFields } from "./SectionFields";
import { MediaUploadField } from "../fields/MediaUploadField";
import type { Section, SeoFields } from "@/lib/types";

export function SectionsEditor({
  pageType,
  initialSections,
  initialSeo,
  extra,
}: {
  pageType: "homePage" | "aboutPage" | "workPage" | "contactPage";
  initialSections: Section[];
  initialSeo?: SeoFields;
  extra?: { heading?: string; subline?: string };
}) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [addType, setAddType] = useState<SectionType>(SECTION_TYPES[0]);
  const [heading, setHeading] = useState(extra?.heading || "");
  const [subline, setSubline] = useState(extra?.subline || "");
  const [seoTitle, setSeoTitle] = useState(initialSeo?.title || "");
  const [seoDescription, setSeoDescription] = useState(initialSeo?.description || "");
  const [seoImageRef, setSeoImageRef] = useState(initialSeo?.shareImage?.asset?._ref);
  const [seoOpen, setSeoOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const updateSection = (key: string, patch: Record<string, any>) => {
    setSections((list) => list.map((s) => (s._key === key ? ({ ...s, ...patch } as Section) : s)));
  };

  const remove = (key: string) => {
    if (!confirm("Remove this section?")) return;
    setSections((list) => list.filter((s) => s._key !== key));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
  };

  const addSection = () => {
    const next = defaultSectionFor(addType) as unknown as Section;
    setSections((list) => [...list, next]);
    setOpenKey(next._key);
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/manage/page/${pageType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections,
          heading,
          subline,
          seo: {
            title: seoTitle,
            description: seoDescription,
            shareImage: seoImageRef ? { _type: "image", asset: { _type: "reference", _ref: seoImageRef } } : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage({ type: "ok", text: "Saved — live on the site now." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {pageType === "workPage" && (
        <div className="grid gap-4 rounded border border-detail/30 p-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-70">Grid heading</span>
            <input value={heading} onChange={(e) => setHeading(e.target.value)} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-70">Grid subline</span>
            <input value={subline} onChange={(e) => setSubline(e.target.value)} className={inputClass} />
          </label>
        </div>
      )}

      <div className="rounded border border-detail/30">
        <button type="button" onClick={() => setSeoOpen((v) => !v)} className="flex w-full items-center justify-between p-3 text-left">
          <span className="font-headline italic">SEO + sharing</span>
          <span className="text-xs uppercase tracking-widest underline">{seoOpen ? "Close" : "Edit"}</span>
        </button>
        {seoOpen && (
          <div className="flex flex-col gap-4 border-t border-detail/20 p-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Page title</span>
              <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={inputClass} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Description</span>
              <textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={inputClass} />
            </label>
            <MediaUploadField label="Share image" kind="image" currentAssetRef={seoImageRef} onUploaded={(ref) => setSeoImageRef(ref)} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 sticky top-0 z-10 bg-paper/95 py-2 backdrop-blur">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save page"}
        </button>
        {message && (
          <span className={`text-sm ${message.type === "error" ? "text-accent" : "opacity-70"}`}>{message.text}</span>
        )}
      </div>

      {sections.map((section, i) => {
        const type = section._type as SectionType;
        const open = openKey === section._key;
        return (
          <div key={section._key} className="rounded border border-detail/30">
            <div className="flex flex-wrap items-center gap-3 p-3">
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-20">▲</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="text-xs disabled:opacity-20">▼</button>
              </div>
              <button type="button" onClick={() => setOpenKey(open ? null : section._key)} className="font-headline italic">
                {SECTION_LABELS[type] || type}
              </button>
              <label className="flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={section.enabled !== false}
                  onChange={(e) => updateSection(section._key, { enabled: e.target.checked })}
                />
                Show
              </label>
              <select
                value={section.background || "paper"}
                onChange={(e) => updateSection(section._key, { background: e.target.value })}
                className="rounded border border-detail/40 bg-transparent px-2 py-1 text-xs"
              >
                <option value="paper">Paper</option>
                <option value="ink">Ink</option>
                <option value="soft">Soft</option>
              </select>
              <div className="ml-auto flex gap-3">
                <button type="button" onClick={() => setOpenKey(open ? null : section._key)} className="text-xs uppercase tracking-widest underline">
                  {open ? "Close" : "Edit"}
                </button>
                <button type="button" onClick={() => remove(section._key)} className="text-xs uppercase tracking-widest opacity-60 underline">
                  Remove
                </button>
              </div>
            </div>
            {open && (
              <div className="border-t border-detail/20 p-4">
                <SectionFields type={type} data={section} onChange={(next) => updateSection(section._key, next)} />
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-center gap-3 rounded border border-dashed border-detail/40 p-4">
        <select value={addType} onChange={(e) => setAddType(e.target.value as SectionType)} className={`${inputClass} max-w-xs`}>
          {SECTION_TYPES.map((t) => (
            <option key={t} value={t}>{SECTION_LABELS[t]}</option>
          ))}
        </select>
        <button type="button" onClick={addSection} className="rounded-full bg-accent px-6 py-2 text-xs uppercase tracking-widest text-paper">
          + Add section
        </button>
      </div>
    </div>
  );
}
