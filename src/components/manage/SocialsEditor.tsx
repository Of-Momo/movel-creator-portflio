"use client";

import { useState } from "react";
import type { Social } from "@/lib/types";

const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "YouTube", "X"];

export function SocialsEditor({ initial }: { initial: (Social & { _id: string })[] }) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newPlatform, setNewPlatform] = useState(PLATFORMS[0]);
  const [newHandle, setNewHandle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const updateField = (id: string, field: "platform" | "handle" | "url", value: string) => {
    setItems((list) => list.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  const save = async (item: Social & { _id: string }) => {
    setBusyId(item._id);
    setError("");
    try {
      const res = await fetch("/api/manage/socials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: item._id, platform: item.platform, handle: item.handle, url: item.url }),
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
      const res = await fetch(`/api/manage/socials?id=${id}`, { method: "DELETE" });
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
    await fetch("/api/manage/socials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i._id) }),
    });
  };

  const addNew = async () => {
    if (!newUrl.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/manage/socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: newPlatform, handle: newHandle, url: newUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed.");
      setItems((list) => [...list, { _id: data._id, platform: newPlatform, handle: newHandle, url: newUrl }]);
      setNewHandle("");
      setNewUrl("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const inputClass = "rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {error && <p className="text-sm text-accent">{error}</p>}
      {items.map((item, i) => (
        <div key={item._id} className="flex flex-wrap items-center gap-2 rounded border border-detail/30 p-3">
          <div className="flex flex-col gap-1">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-20">▲</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-xs disabled:opacity-20">▼</button>
          </div>
          <select value={item.platform} onChange={(e) => updateField(item._id, "platform", e.target.value)} className={inputClass}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <input
            value={item.handle || ""}
            onChange={(e) => updateField(item._id, "handle", e.target.value)}
            placeholder="Handle"
            className={`${inputClass} w-32`}
          />
          <input
            value={item.url}
            onChange={(e) => updateField(item._id, "url", e.target.value)}
            placeholder="https://..."
            className={`${inputClass} flex-1 min-w-[200px]`}
          />
          <button
            type="button"
            disabled={busyId === item._id}
            onClick={() => save(item)}
            className="rounded-full border border-detail/40 px-4 py-1.5 text-xs uppercase tracking-widest"
          >
            Save
          </button>
          <button
            type="button"
            disabled={busyId === item._id}
            onClick={() => remove(item._id)}
            className="text-xs uppercase tracking-widest opacity-60 underline"
          >
            Delete
          </button>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 rounded border border-dashed border-detail/40 p-3">
        <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} className={inputClass}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input value={newHandle} onChange={(e) => setNewHandle(e.target.value)} placeholder="Handle" className={`${inputClass} w-32`} />
        <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className={`${inputClass} flex-1 min-w-[200px]`} />
        <button
          type="button"
          disabled={adding || !newUrl.trim()}
          onClick={addNew}
          className="rounded-full bg-accent px-4 py-1.5 text-xs uppercase tracking-widest text-paper disabled:opacity-40"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
