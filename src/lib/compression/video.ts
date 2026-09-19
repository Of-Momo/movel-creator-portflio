import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

async function getFFmpeg(onLog?: (msg: string) => void) {
  if (ffmpegInstance) return ffmpegInstance;
  if (!loadPromise) {
    loadPromise = (async () => {
      const ffmpeg = new FFmpeg();
      if (onLog) ffmpeg.on("log", ({ message }) => onLog(message));
      await ffmpeg.load({
        coreURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegInstance = ffmpeg;
      return ffmpeg;
    })();
  }
  return loadPromise;
}

export class CompressionTooHeavyError extends Error {
  constructor() {
    super("This one's too heavy for your phone to shrink. Try it on your laptop, or export it at 1080p first.");
    this.name = "CompressionTooHeavyError";
  }
}

const MAX_INPUT_BYTES = 800 * 1024 * 1024; // ~800MB safety ceiling for mobile memory
const TIMEOUT_MS = 6 * 60 * 1000; // 6 minutes — beyond this, treat the device as too slow for the job

export async function compressVideo(
  file: File,
  onProgress: (pct: number, label: string) => void
): Promise<File> {
  if (file.size > MAX_INPUT_BYTES) {
    throw new CompressionTooHeavyError();
  }

  onProgress(0, "Preparing…");
  let ffmpeg: FFmpeg;
  try {
    ffmpeg = await getFFmpeg();
  } catch {
    throw new CompressionTooHeavyError();
  }

  const inputName = "input" + extOf(file.name);
  const outputName = "output.mp4";

  const progressHandler = ({ progress }: { progress: number }) => {
    onProgress(Math.min(95, Math.round(progress * 100)), "Compressing…");
  };
  ffmpeg.on("progress", progressHandler);

  try {
    await ffmpeg.writeFile(inputName, await fetchFile(file));

    const run = ffmpeg.exec([
      "-i", inputName,
      "-vf", "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease",
      "-c:v", "libx264",
      "-preset", "veryfast",
      "-crf", "24",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac",
      "-b:a", "128k",
      "-movflags", "+faststart",
      outputName,
    ]);

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new CompressionTooHeavyError()), TIMEOUT_MS)
    );
    await Promise.race([run, timeout]);

    onProgress(97, "Finishing…");
    const data = await ffmpeg.readFile(outputName);
    const blob = new Blob([data as unknown as BlobPart], { type: "video/mp4" });
    onProgress(100, "Done");

    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    return new File([blob], renameToMp4(file.name), { type: "video/mp4" });
  } catch (err) {
    if (err instanceof CompressionTooHeavyError) throw err;
    throw new CompressionTooHeavyError();
  } finally {
    ffmpeg.off("progress", progressHandler);
  }
}

function extOf(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i);
}

function renameToMp4(name: string) {
  const i = name.lastIndexOf(".");
  return (i === -1 ? name : name.slice(0, i)) + ".mp4";
}

export async function readVideoOrientation(file: File): Promise<"vertical" | "horizontal"> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      const orientation = video.videoHeight >= video.videoWidth ? "vertical" : "horizontal";
      URL.revokeObjectURL(video.src);
      resolve(orientation);
    };
    video.onerror = () => resolve("vertical");
    video.src = URL.createObjectURL(file);
  });
}

export async function grabFrameAt(file: File, atSeconds: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(atSeconds, Math.max(0, video.duration - 0.1));
    };
    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(video.src);
          if (blob) resolve(blob);
          else reject(new Error("Could not capture frame"));
        },
        "image/jpeg",
        0.9
      );
    };
    video.onerror = () => reject(new Error("Could not read video"));
  });
}
