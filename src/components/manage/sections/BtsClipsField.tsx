"use client";

import { MediaUploadField } from "../fields/MediaUploadField";

interface Clip {
  _key: string;
  video?: { asset?: { _ref: string } };
  poster?: { asset?: { _ref: string } };
  caption?: string;
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function BtsClipsField({ clips, onChange }: { clips: Clip[]; onChange: (next: Clip[]) => void }) {
  const update = (i: number, patch: Partial<Clip>) => {
    const next = [...clips];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(clips.filter((_, idx) => idx !== i));
  const add = () => onChange([...clips, { _key: randomKey() }]);

  const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm opacity-70">Clips</span>
      {clips.map((clip, i) => (
        <div key={clip._key} className="grid gap-3 rounded border border-detail/30 p-3 sm:grid-cols-3">
          <MediaUploadField label="Video" kind="video" currentAssetRef={clip.video?.asset?._ref} onUploaded={(ref) => update(i, { video: { asset: { _ref: ref } } })} />
          <MediaUploadField label="Poster" kind="image" currentAssetRef={clip.poster?.asset?._ref} onUploaded={(ref) => update(i, { poster: { asset: { _ref: ref } } })} />
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Caption</span>
              <input value={clip.caption || ""} onChange={(e) => update(i, { caption: e.target.value })} className={inputClass} />
            </label>
            <button type="button" onClick={() => remove(i)} className="w-fit text-xs uppercase tracking-widest opacity-60 underline">
              Remove clip
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="w-fit rounded-full border border-detail/40 px-4 py-1.5 text-xs uppercase tracking-widest">
        + Add clip
      </button>
    </div>
  );
}
