import type { MetadataRoute } from "next";
import { getAllProjectsForGrid } from "@/sanity/lib/fetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movelstudio.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getAllProjectsForGrid();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/intro`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projects as any[]).map((p) => ({
    url: `${SITE_URL}/work/${p.slug.current}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes];
}
