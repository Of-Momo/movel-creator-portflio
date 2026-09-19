"use client";

import { useState } from "react";
import { MediaUploadField } from "./fields/MediaUploadField";
import type { Brand } from "@/lib/types";

type Item = Brand & { _id: string; isPlaceholder?: boolean };

export function BrandsEditor({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newLogoRef, setNewLogoRef] = useState<string | undefined>();
  const [adding, setAdding] = useState(false);

  const updateField = (id: string, field: "name" | "showOnSite", value: any) => {
    setItems((list) => list.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  const save = async (item: Item, logoAssetRef?: string) => {
    setBusyId(item._id);
    setError("");
    try {
      const res = await fetch("/api/manage/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: item._id, name: item.name, showOnSite: item.showOnSite, logoAssetRef }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/manage/brands?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed.");
      setItems((list) => list.filter((i) => i._id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const addNew = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/manage/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, showOnSite: true, logoAssetRef: newLogoRef }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed.");
      setItems((list) => [
        ...list,
        { _id: data._id, name: newName, showOnSite: true, logo: newLogoRef ? ({ asset: { _ref: newLogoRef } } as any) : undefined },
      ]);
      setNewName("");
      setNewLogoRef(undefined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {error && <p className="text-sm text-accent">{error}</p>}
      {items.map((item) => (
        <div key={item._id} className="flex flex-wrap items-start gap-3 rounded border border-detail/30 p-3">
          <input
            value={item.name}
            onChange={(e) => updateField(item._id, "name", e.target.value)}
            className={`${inputClass} max-w-xs`}
          />
          <MediaUploadField
            label="Logo"
            kind="image"
            currentAssetRef={item.logo?.asset?._ref}
            onUploaded={(ref) => save(item, ref)}
          />
          <label className="flex items-center gap-1.5 text-xs">
            <input
              type="checkbox"
              checked={Boolean(item.showOnSite)}
              onChange={(e) => {
                updateField(item._id, "showOnSite", e.target.checked);
              }}
            />
            Show on site
          </label>
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
      ))}

      <div className="flex flex-wrap items-center gap-3 rounded border border-dashed border-detail/40 p-3">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Brand name" className={`${inputClass} max-w-xs`} />
        <MediaUploadField label="Logo" kind="image" currentAssetRef={newLogoRef} onUploaded={(ref) => setNewLogoRef(ref)} />
        <button
          type="button"
          disabled={adding || !newName.trim()}
          onClick={addNew}
          className="rounded-full bg-accent px-4 py-1.5 text-xs uppercase tracking-widest text-paper disabled:opacity-40"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
