export async function compressImage(file: File, maxDimension = 2400, quality = 0.85): Promise<File> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("This image couldn't be read. Try a different file.");

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported on this device.");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  if (!blob) throw new Error("Could not compress this image.");

  const base = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}
