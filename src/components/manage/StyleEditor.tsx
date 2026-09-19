"use client";

import { useState } from "react";
import {
  DEFAULT_THEME,
  HEADLINE_FONTS,
  BODY_FONTS,
  SIGNATURE_FONTS,
} from "@/lib/themeConstants";
import type { ThemeColors, ThemeFonts } from "@/lib/types";

type Preset = { _key: string; name: string; colors: ThemeColors; fonts: ThemeFonts };

const COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: "paper", label: "Paper — main background" },
  { key: "ink", label: "Ink — text, dark sections" },
  { key: "accent", label: "Accent — links, buttons, Mo's name" },
  { key: "soft", label: "Soft — quote backgrounds, highlights" },
  { key: "detail", label: "Detail — thin rules, issue numbers" },
];

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function StyleEditor({
  initialColors,
  initialFonts,
  initialPresets,
}: {
  initialColors: ThemeColors;
  initialFonts: ThemeFonts;
  initialPresets: Preset[];
}) {
  const [colors, setColors] = useState<ThemeColors>(initialColors);
  const [fonts, setFonts] = useState<ThemeFonts>(initialFonts);
  const [presets, setPresets] = useState<Preset[]>(initialPresets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [newPresetName, setNewPresetName] = useState("");

  const save = async (nextColors: ThemeColors, nextFonts: ThemeFonts, nextPresets: Preset[]) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/manage/style", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: nextColors, fonts: nextFonts, presets: nextPresets }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setColors(nextColors);
      setFonts(nextFonts);
      setPresets(nextPresets);
      setMessage({ type: "ok", text: "Saved — live on the site now." });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const setColor = (key: keyof ThemeColors, hex: string) => {
    setColors((c) => ({ ...c, [key]: { hex } }));
  };

  const applyPreset = (preset: Preset) => {
    save(preset.colors, preset.fonts, presets);
  };

  const deletePreset = (key: string) => {
    save(colors, fonts, presets.filter((p) => p._key !== key));
  };

  const saveAsPreset = () => {
    if (!newPresetName.trim()) return;
    const next: Preset = { _key: randomKey(), name: newPresetName.trim(), colors, fonts };
    setNewPresetName("");
    save(colors, fonts, [...presets, next]);
  };

  const resetToOriginal = () => {
    save(DEFAULT_THEME.colors as ThemeColors, DEFAULT_THEME.fonts, presets);
  };

  const previewStyle: React.CSSProperties = {
    background: colors.paper?.hex,
    color: colors.ink?.hex,
    fontFamily: `"${fonts.body}", sans-serif`,
    border: `1px solid ${colors.detail?.hex}`,
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="font-headline text-xl italic">Colours</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {COLOR_FIELDS.map(({ key, label }) => (
              <label key={key} className="flex flex-col gap-1 text-sm">
                <span className="opacity-70">{label}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[key]?.hex || "#000000"}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="h-9 w-9 shrink-0 cursor-pointer rounded border border-detail/40 bg-transparent"
                  />
                  <input
                    type="text"
                    value={colors[key]?.hex || ""}
                    onChange={(e) => setColor(key, e.target.value)}
                    className="w-full rounded border border-detail/40 bg-transparent px-2 py-1.5 font-mono text-sm outline-none focus:border-accent"
                  />
                </div>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-headline text-xl italic">Fonts</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Headline</span>
              <select
                value={fonts.headline}
                onChange={(e) => setFonts((f) => ({ ...f, headline: e.target.value }))}
                className="rounded border border-detail/40 bg-transparent px-2 py-1.5 outline-none focus:border-accent"
              >
                {HEADLINE_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: `"${f}", serif` }}>{f}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Body</span>
              <select
                value={fonts.body}
                onChange={(e) => setFonts((f) => ({ ...f, body: e.target.value }))}
                className="rounded border border-detail/40 bg-transparent px-2 py-1.5 outline-none focus:border-accent"
              >
                {BODY_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>{f}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Signature</span>
              <select
                value={fonts.signature}
                onChange={(e) => setFonts((f) => ({ ...f, signature: e.target.value }))}
                className="rounded border border-detail/40 bg-transparent px-2 py-1.5 outline-none focus:border-accent"
              >
                {SIGNATURE_FONTS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: `"${f}", cursive` }}>{f}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => save(colors, fonts, presets)}
            className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={resetToOriginal}
            className="rounded-full border border-detail/40 px-6 py-3 text-sm uppercase tracking-[0.15em] disabled:opacity-40"
          >
            Reset to original
          </button>
          {message && (
            <span className={`text-sm ${message.type === "error" ? "text-accent" : "opacity-70"}`}>
              {message.text}
            </span>
          )}
        </div>

        <section>
          <h2 className="font-headline text-xl italic">Saved presets</h2>
          <div className="mt-4 flex flex-col gap-2">
            {presets.map((p) => (
              <div key={p._key} className="flex items-center justify-between rounded border border-detail/30 px-3 py-2">
                <span className="text-sm">{p.name}</span>
                <div className="flex gap-3">
                  <button type="button" disabled={saving} onClick={() => applyPreset(p)} className="text-xs uppercase tracking-widest text-accent underline">
                    Apply
                  </button>
                  <button type="button" disabled={saving} onClick={() => deletePreset(p._key)} className="text-xs uppercase tracking-widest opacity-60 underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {presets.length === 0 && <p className="text-sm opacity-60">No saved presets yet.</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Name this look…"
              className="w-full max-w-xs rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              disabled={saving || !newPresetName.trim()}
              onClick={saveAsPreset}
              className="shrink-0 rounded-full border border-detail/40 px-4 py-2 text-xs uppercase tracking-widest disabled:opacity-40"
            >
              Save as preset
            </button>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg p-6" style={previewStyle}>
        <p className="text-xs uppercase tracking-[0.2em] opacity-70">Live preview</p>
        <p className="mt-4" style={{ fontFamily: `"${fonts.headline}", serif`, fontStyle: "italic", fontSize: "1.75rem" }}>
          Mo, Content Creator
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          This is what your body text looks like with these colours and fonts applied across the site.
        </p>
        <p className="mt-4 inline-block rounded-full px-5 py-2 text-sm uppercase tracking-widest" style={{ background: colors.accent?.hex, color: colors.paper?.hex }}>
          Work with Mo
        </p>
        <p className="mt-6" style={{ fontFamily: `"${fonts.signature}", cursive`, fontSize: "1.5rem", color: colors.accent?.hex }}>
          Mo
        </p>
      </aside>
    </div>
  );
}
