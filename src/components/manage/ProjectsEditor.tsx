"use client";

import { useState } from "react";
import { MediaUploadField } from "./fields/MediaUploadField";

interface ManageProject {
  _id: string;
  number: number;
  caption: string;
  thumbnail?: { asset?: { _ref: string } };
  video?: { asset?: { _ref: string } };
  reasoningVideo?: { asset?: { _ref: string } };
  orientation: "vertical" | "horizontal";
  showOnHomepage?: boolean;
  isPlaceholder?: boolean;
  brandId?: string;
}

export function ProjectsEditor({
  initial,
  brands,
}: {
  initial: ManageProject[];
  brands: { _id: string; name: string }[];
}) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [pendingAssets, setPendingAssets] = useState<Record<string, { video?: string; thumbnail?: string; reasoning?: string }>>({});

  const [adding, setAdding] = useState(false);
  const [newBrandId, setNewBrandId] = useState(brands[0]?._id || "");
  const [newCaption, setNewCaption] = useState("");
  const [newOrientation, setNewOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [newVideoRef, setNewVideoRef] = useState<string>();
  const [newThumbRef, setNewThumbRef] = useState<string>();

  const updateField = (id: string, field: keyof ManageProject, value: any) => {
    setItems((list) => list.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  const setPending = (id: string, kind: "video" | "thumbnail" | "reasoning", ref: string) => {
    setPendingAssets((p) => ({ ...p, [id]: { ...p[id], [kind]: ref } }));
  };

  const save = async (item: ManageProject) => {
    setBusyId(item._id);
    setError("");
    const pending = pendingAssets[item._id] || {};
    try {
      const res = await fetch("/api/manage/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: item._id,
          caption: item.caption,
          brandId: item.brandId,
          orientation: item.orientation,
          showOnHomepage: item.showOnHomepage,
          videoAssetRef: pending.video,
          thumbnailAssetRef: pending.thumbnail,
          reasoningVideoAssetRef: pending.reasoning,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed.");
      setPendingAssets((p) => ({ ...p, [item._id]: {} }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/manage/projects?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed.");
      setItems((list) => list.filter((i) => i._id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await fetch("/api/manage/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ swapRanks: [items[index]._id, items[target]._id] }),
    });
  };

  const addNew = async () => {
    if (!newCaption.trim() || !newVideoRef || !newThumbRef || !newBrandId) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/manage/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoAssetRef: newVideoRef,
          thumbnailAssetRef: newThumbRef,
          brandId: newBrandId,
          caption: newCaption,
          orientation: newOrientation,
          showOnHomepage: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed.");
      setItems((list) => [
        ...list,
        {
          _id: data._id,
          number: (list[list.length - 1]?.number || 0) + 1,
          caption: newCaption,
          brandId: newBrandId,
          orientation: newOrientation,
          showOnHomepage: false,
          video: { asset: { _ref: newVideoRef } },
          thumbnail: { asset: { _ref: newThumbRef } },
        },
      ]);
      setNewCaption("");
      setNewVideoRef(undefined);
      setNewThumbRef(undefined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {error && <p className="text-sm text-accent">{error}</p>}
      {items.map((item, i) => (
        <div key={item._id} className="flex flex-col gap-3 rounded border border-detail/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-20">▲</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-xs disabled:opacity-20">▼</button>
            </div>
            <span className="font-headline italic">No. {String(item.number).padStart(2, "0")}</span>
            {item.isPlaceholder && <span className="text-xs uppercase tracking-widest text-accent">Placeholder</span>}
            <div className="ml-auto flex gap-3">
              <button type="button" disabled={busyId === item._id} onClick={() => save(item)} className="rounded-full border border-detail/40 px-4 py-1.5 text-xs uppercase tracking-widest">
                Save
              </button>
              <button type="button" disabled={busyId === item._id} onClick={() => remove(item._id)} className="text-xs uppercase tracking-widest opacity-60 underline">
                Delete
              </button>
            </div>
          </div>

          <textarea
            value={item.caption}
            onChange={(e) => updateField(item._id, "caption", e.target.value)}
            rows={3}
            className={inputClass}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Brand</span>
              <select value={item.brandId} onChange={(e) => updateField(item._id, "brandId", e.target.value)} className={inputClass}>
                {brands.map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Orientation</span>
              <select value={item.orientation} onChange={(e) => updateField(item._id, "orientation", e.target.value)} className={inputClass}>
                <option value="vertical">Vertical (9:16)</option>
                <option value="horizontal">Horizontal (16:9)</option>
              </select>
            </label>
          </div>

          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={Boolean(item.showOnHomepage)}
              onChange={(e) => updateField(item._id, "showOnHomepage", e.target.checked)}
            />
            Show on homepage
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <MediaUploadField label="Video" kind="video" currentAssetRef={item.video?.asset?._ref} onUploaded={(ref) => setPending(item._id, "video", ref)} />
            <MediaUploadField label="Thumbnail" kind="image" currentAssetRef={item.thumbnail?.asset?._ref} onUploaded={(ref) => setPending(item._id, "thumbnail", ref)} />
            <MediaUploadField label="Reasoning video (optional)" kind="video" currentAssetRef={item.reasoningVideo?.asset?._ref} onUploaded={(ref) => setPending(item._id, "reasoning", ref)} />
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-3 rounded border border-dashed border-detail/40 p-4">
        <h3 className="font-headline italic">New project</h3>
        <textarea value={newCaption} onChange={(e) => setNewCaption(e.target.value)} rows={3} placeholder="Caption" className={inputClass} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select value={newBrandId} onChange={(e) => setNewBrandId(e.target.value)} className={inputClass}>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          <select value={newOrientation} onChange={(e) => setNewOrientation(e.target.value as any)} className={inputClass}>
            <option value="vertical">Vertical (9:16)</option>
            <option value="horizontal">Horizontal (16:9)</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaUploadField label="Video" kind="video" onUploaded={(ref) => setNewVideoRef(ref)} />
          <MediaUploadField label="Thumbnail" kind="image" onUploaded={(ref) => setNewThumbRef(ref)} />
        </div>
        <button
          type="button"
          disabled={adding || !newCaption.trim() || !newVideoRef || !newThumbRef}
          onClick={addNew}
          className="w-fit rounded-full bg-accent px-6 py-2 text-xs uppercase tracking-widest text-paper disabled:opacity-40"
        >
          + Add project
        </button>
      </div>
    </div>
  );
}
