"use client";

import { useState } from "react";
import type { Faq } from "@/lib/types";

type Item = Faq & { _id: string };

export function FaqEditor({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  const updateField = (id: string, field: keyof Item, value: any) => {
    setItems((list) => list.map((i) => (i._id === id ? { ...i, [field]: value } : i)));
  };

  const save = async (item: Item) => {
    setBusyId(item._id);
    setError("");
    try {
      const res = await fetch("/api/manage/faq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: item._id,
          question: item.question,
          answer: item.answer,
          showOnHomepage: item.showOnHomepage,
          showOnAbout: item.showOnAbout,
        }),
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
      const res = await fetch(`/api/manage/faq?id=${id}`, { method: "DELETE" });
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
    await fetch("/api/manage/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((i) => i._id) }),
    });
  };

  const addNew = async () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/manage/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer, showOnHomepage: false, showOnAbout: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Add failed.");
      setItems((list) => [
        ...list,
        { _id: data._id, question: newQuestion, answer: newAnswer, showOnHomepage: false, showOnAbout: true },
      ]);
      setNewQuestion("");
      setNewAnswer("");
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
      {items.map((item, i) => (
        <div key={item._id} className="flex gap-2 rounded border border-detail/30 p-3">
          <div className="flex flex-col gap-1 pt-1">
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-20">▲</button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="text-xs disabled:opacity-20">▼</button>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              value={item.question}
              onChange={(e) => updateField(item._id, "question", e.target.value)}
              className={inputClass}
              placeholder="Question"
            />
            <textarea
              value={item.answer}
              onChange={(e) => updateField(item._id, "answer", e.target.value)}
              rows={2}
              className={inputClass}
              placeholder="Answer"
            />
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(item.showOnHomepage)}
                  onChange={(e) => updateField(item._id, "showOnHomepage", e.target.checked)}
                />
                Show on homepage
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={Boolean(item.showOnAbout)}
                  onChange={(e) => updateField(item._id, "showOnAbout", e.target.checked)}
                />
                Show on About
              </label>
              <button type="button" disabled={busyId === item._id} onClick={() => save(item)} className="rounded-full border border-detail/40 px-4 py-1 uppercase tracking-widest">
                Save
              </button>
              <button type="button" disabled={busyId === item._id} onClick={() => remove(item._id)} className="uppercase tracking-widest opacity-60 underline">
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex flex-col gap-2 rounded border border-dashed border-detail/40 p-3">
        <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="New question" className={inputClass} />
        <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} rows={2} placeholder="Answer" className={inputClass} />
        <button
          type="button"
          disabled={adding || !newQuestion.trim() || !newAnswer.trim()}
          onClick={addNew}
          className="w-fit rounded-full bg-accent px-4 py-1.5 text-xs uppercase tracking-widest text-paper disabled:opacity-40"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
