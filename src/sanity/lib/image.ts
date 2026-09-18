import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId: projectId || "placeholder", dataset });

export function urlForImage(source?: Image | null) {
  if (!source?.asset?._ref) return undefined;
  return builder.image(source).auto("format").fit("max");
}

export function fileUrl(assetRef?: string) {
  if (!assetRef) return undefined;
  // file asset ref format: file-<id>-<extension>
  const [, id, ext] = assetRef.split("-");
  return `https://cdn.sanity.io/files/${projectId || "placeholder"}/${dataset}/${id}.${ext}`;
}
