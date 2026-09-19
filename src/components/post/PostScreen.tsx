"use client";

import { useMemo, useState } from "react";
import { useMediaUpload } from "@/lib/compression/useMediaUpload";
import { grabFrameAt } from "@/lib/compression/video";
import { compressImage } from "@/lib/compression/image";
import { UploadStatus } from "./UploadStatus";
import { FrameScrubber } from "./FrameScrubber";
import type { Brand } from "@/lib/types";

type PublishState = "idle" | "publishing" | "published" | "error";

export function PostScreen({ brands, role }: { brands: Brand[]; role: "owner" | "assistant" }) {
  const video = useMediaUpload("video");
  const reasoning = useMediaUpload("video");
  const thumbnail = useMediaUpload("image");

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [reasoningFile, setReasoningFile] = useState<File | null>(null);
  const [thumbMode, setThumbMode] = useState<"scrub" | "upload" | null>(null);
  const [frameTime, setFrameTime] = useState(1);

  const [brandId, setBrandId] = useState("");
  const [newBrandName, setNewBrandName] = useState("");
  const [caption, setCaption] = useState("");
  const [showOnHomepage, setShowOnHomepage] = useState(false);

  const [preview, setPreview] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishError, setPublishError] = useState("");

  const canPublish =
    video.stage === "done" &&
    thumbnail.stage === "done" &&
    caption.trim().length > 0 &&
    (brandId || newBrandName.trim());

  const handleVideoPick = async (file: File) => {
    setVideoFile(file);
    await video.upload(file);
  };

  const handleReasoningPick = async (file: File) => {
    setReasoningFile(file);
    await reasoning.upload(file);
  };

  const handleThumbUpload = async (file: File) => {
    await thumbnail.upload(file);
  };

  const handleUseFrame = async () => {
    if (!videoFile) return;
    const blob = await grabFrameAt(videoFile, frameTime);
    const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
    const compressed = await compressImage(file);
    await thumbnail.upload(compressed);
  };

  const autoGrabIfSkipped = async () => {
    if (thumbnail.stage === "done" || !videoFile) return;
    const blob = await grabFrameAt(videoFile, 1);
    const file = new File([blob], "thumbnail.jpg", { type: "image/jpeg" });
    const compressed = await compressImage(file);
    await thumbnail.upload(compressed);
  };

  const captionPreviewLines = useMemo(() => caption.split("\n").slice(0, 3).join("\n"), [caption]);

  const handlePublish = async () => {
    setPublishState("publishing");
    setPublishError("");
    try {
      await autoGrabIfSkipped();
      const res = await fetch("/api/post/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoAssetRef: video.result?.assetRef,
          brandId: brandId || undefined,
          newBrandName: brandId ? undefined : newBrandName.trim(),
          caption,
          reasoningVideoAssetRef: reasoning.result?.assetRef,
          thumbnailAssetRef: thumbnail.result?.assetRef,
          showOnHomepage,
          orientation: video.result?.orientation,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Publishing failed.");
      setPublishState("published");
    } catch (err: any) {
      setPublishState("error");
      setPublishError(err.message);
    }
  };

  if (publishState === "published") {
    return (
      <div className="mt-16 text-center">
        <p className="font-headline text-2xl italic">
          {role === "assistant" ? "Saved as a draft." : "Published."}
        </p>
        <p className="mt-2 opacity-70">
          {role === "assistant"
            ? "Mo will review it before it goes live."
            : "It's live at the top of the feed."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em] text-paper"
        >
          Post another
        </button>
      </div>
    );
  }

  if (preview) {
    return (
      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-widest opacity-60">Preview</p>
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-ink text-paper">
          {videoFile && (
            <video src={URL.createObjectURL(videoFile)} className="h-full w-full object-cover" muted autoPlay loop playsInline />
          )}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-headline text-sm italic">
              {brandId ? brands.find((b) => b._id === brandId)?.name : newBrandName}
            </p>
            <p className="mt-1 whitespace-pre-line text-sm">{captionPreviewLines}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className="flex-1 rounded-full border border-accent px-6 py-3 text-sm uppercase tracking-[0.1em] text-accent"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={publishState === "publishing"}
            className="flex-1 rounded-full bg-accent px-6 py-3 text-sm uppercase tracking-[0.1em] text-paper disabled:opacity-50"
          >
            {publishState === "publishing" ? "Publishing…" : role === "assistant" ? "Save as draft" : "Publish"}
          </button>
        </div>
        {publishState === "error" && <p className="mt-3 text-sm text-accent">{publishError}</p>}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-8">
      <Field label="1. Upload video">
        <input
          type="file"
          accept="video/*"
          capture="environment"
          onChange={(e) => e.target.files?.[0] && handleVideoPick(e.target.files[0])}
          className="block w-full text-sm"
        />
        <UploadStatus stage={video.stage} progress={video.progress} label={video.label} error={video.error} />
      </Field>

      <Field label="2. Brand">
        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="w-full rounded border border-detail/40 bg-transparent px-4 py-3 text-sm"
        >
          <option value="">Type a new brand below…</option>
          {brands.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        {!brandId && (
          <input
            type="text"
            placeholder="New brand name"
            value={newBrandName}
            onChange={(e) => setNewBrandName(e.target.value)}
            className="mt-2 w-full rounded border border-detail/40 bg-transparent px-4 py-3 text-sm"
          />
        )}
      </Field>

      <Field label="3. Caption">
        <textarea
          rows={5}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="First 3 lines show in the feed. Add a line with just --- to mark where 'more' starts."
          className="w-full rounded border border-detail/40 bg-transparent px-4 py-3 text-sm"
        />
      </Field>

      <Field label="4. Reasoning video (optional)">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleReasoningPick(e.target.files[0])}
          className="block w-full text-sm"
        />
        <UploadStatus stage={reasoning.stage} progress={reasoning.progress} label={reasoning.label} error={reasoning.error} />
      </Field>

      <Field label="5. Thumbnail">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setThumbMode("scrub")}
            disabled={!videoFile}
            className={`flex-1 rounded-full border px-4 py-2 text-sm disabled:opacity-40 ${thumbMode === "scrub" ? "border-accent bg-accent text-paper" : "border-detail/40"}`}
          >
            Pick a frame
          </button>
          <button
            type="button"
            onClick={() => setThumbMode("upload")}
            className={`flex-1 rounded-full border px-4 py-2 text-sm ${thumbMode === "upload" ? "border-accent bg-accent text-paper" : "border-detail/40"}`}
          >
            Upload image
          </button>
        </div>
        {thumbMode === "scrub" && videoFile && (
          <div className="mt-3">
            <FrameScrubber file={videoFile} onFrameChosen={setFrameTime} />
            <button
              type="button"
              onClick={handleUseFrame}
              className="mt-2 rounded-full bg-accent px-5 py-2 text-sm text-paper"
            >
              Use this frame
            </button>
          </div>
        )}
        {thumbMode === "upload" && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleThumbUpload(e.target.files[0])}
            className="mt-3 block w-full text-sm"
          />
        )}
        <p className="mt-2 text-xs opacity-60">Skip this and we&rsquo;ll grab a frame automatically so nothing posts blank.</p>
        <UploadStatus stage={thumbnail.stage} progress={thumbnail.progress} label={thumbnail.label} error={thumbnail.error} />
      </Field>

      <Field label="6. Show on homepage">
        <button
          type="button"
          role="switch"
          aria-checked={showOnHomepage}
          onClick={() => setShowOnHomepage((v) => !v)}
          className={`h-8 w-14 rounded-full transition-colors ${showOnHomepage ? "bg-accent" : "bg-detail/30"}`}
        >
          <span
            className={`block h-6 w-6 translate-x-1 rounded-full bg-paper transition-transform ${showOnHomepage ? "translate-x-7" : ""}`}
          />
        </button>
      </Field>

      <button
        type="button"
        disabled={!canPublish}
        onClick={() => setPreview(true)}
        className="rounded-full bg-accent px-8 py-4 text-sm uppercase tracking-[0.15em] text-paper disabled:opacity-40"
      >
        Preview
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-headline text-lg italic">{label}</p>
      {children}
    </div>
  );
}
