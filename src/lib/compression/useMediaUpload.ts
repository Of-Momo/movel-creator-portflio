"use client";

import { useCallback, useState } from "react";
import { compressVideo, CompressionTooHeavyError, readVideoOrientation } from "./video";
import { compressImage } from "./image";
import { requestWakeLock, releaseWakeLock } from "@/lib/wakeLock";

export type UploadStage = "idle" | "compressing" | "uploading" | "done" | "error";

export interface UploadResult {
  assetRef: string;
  orientation?: "vertical" | "horizontal";
}

function uploadWithProgress(file: File, onProgress: (pct: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/post/upload-asset");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Upload failed — try again."));
        }
      } else {
        reject(new Error(xhr.responseText || "Upload failed — try again."));
      }
    };
    xhr.onerror = () => reject(new Error("Upload failed — check your connection and try again."));
    const form = new FormData();
    form.append("file", file);
    xhr.send(form);
  });
}

export function useMediaUpload(kind: "video" | "image") {
  const [stage, setStage] = useState<UploadStage>("idle");
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setStage("compressing");
      setError(null);
      setProgress(0);
      await requestWakeLock();
      try {
        let output: File;
        let orientation: "vertical" | "horizontal" | undefined;

        if (kind === "video") {
          orientation = await readVideoOrientation(file);
          output = await compressVideo(file, (pct, lbl) => {
            setProgress(pct);
            setLabel(lbl);
          });
        } else {
          setLabel("Compressing…");
          output = await compressImage(file);
          setProgress(100);
        }

        setStage("uploading");
        setLabel("Uploading…");
        const uploaded = await uploadWithProgress(output, setProgress);
        const finalResult = { ...uploaded, orientation };
        setStage("done");
        setResult(finalResult);
        return finalResult;
      } catch (err) {
        setStage("error");
        setError(err instanceof CompressionTooHeavyError ? err.message : (err as Error).message);
        return null;
      } finally {
        await releaseWakeLock();
      }
    },
    [kind]
  );

  const reset = useCallback(() => {
    setStage("idle");
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return { stage, progress, label, error, result, upload, reset };
}
