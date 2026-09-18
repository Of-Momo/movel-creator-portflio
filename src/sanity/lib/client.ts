import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  stega: false,
});

export const writeClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: "published",
});

export function getDraftModeClient(isDraftMode: boolean) {
  if (!isDraftMode) return client;
  return client.withConfig({
    useCdn: false,
    perspective: "drafts",
    token: process.env.SANITY_API_WRITE_TOKEN,
  });
}
