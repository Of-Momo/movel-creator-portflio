"use client";

import { useRef } from "react";
import { useMediaUpload } from "@/lib/compression/useMediaUpload";
import { urlForImage, fileUrl } from "@/sanity/lib/image";

export function MediaUploadField({
  label,
  kind,
  currentAssetRef,
  onUploaded,
}: {
  label: string;
  kind: "video" | "image";
  currentAssetRef?: string;
  onUploaded: (assetRef: string, orientation?: "vertical" | "horizontal") => void;
}) {
  const { stage, progress, label: stageLabel, error, upload, reset } = useMediaUpload(kind);
  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl =
    kind === "image"
      ? currentAssetRef
        ? urlForImage({ _type: "image", asset: { _type: "reference", _ref: currentAssetRef } } as any)?.width(300).url()
        : undefined
      : fileUrl(currentAssetRef);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    const result = await upload(file);
    if (result) onUploaded(result.assetRef, result.orientation);
  };

  const busy = stage === "compressing" || stage === "uploading";

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="opacity-70">{label}</span>
      {previewUrl && kind === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt="" className="h-24 w-24 rounded object-cover" />
      )}
      {previewUrl && kind === "video" && (
        <video src={previewUrl} muted playsInline className="h-32 w-auto rounded" controls />
      )}
      <input
        ref={inputRef}
        type="file"
        accept={kind === "video" ? "video/*" : "image/*"}
        onChange={(e) => handleFile(e.target.files?.[0] || null)}
        disabled={busy}
        className="text-xs"
      />
      {busy && (
        <p className="text-xs opacity-70">
          {stageLabel || "Working…"} {progress > 0 ? `${progress}%` : ""}
        </p>
      )}
      {error && (
        <p className="text-xs text-accent">
          {error}{" "}
          <button type="button" onClick={reset} className="underline">
            Try again
          </button>
        </p>
      )}
    </div>
  );
}
