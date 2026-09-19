"use client";

import { visionTool } from "@sanity/vision";
import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure, singletonActions, singletonTypes } from "./src/sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const SINGLETON_LOCATIONS: Record<string, string> = {
  homePage: "/",
  aboutPage: "/about",
  workPage: "/work",
  contactPage: "/contact",
};

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter((t) => !singletonTypes.has(t.schemaType as string)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
    newDocumentOptions: (prev) =>
      prev.filter((item) => !singletonTypes.has(item.templateId)),
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: siteUrl,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        locations: {
          ...Object.fromEntries(
            Object.entries(SINGLETON_LOCATIONS).map(([type, href]) => [
              type,
              defineLocations({
                select: {},
                resolve: () => ({ locations: [{ title: href === "/" ? "Homepage" : href, href }] }),
              }),
            ])
          ),
          project: defineLocations({
            select: { slug: "slug.current", number: "number" },
            resolve: (doc) => ({
              locations: [
                { title: doc?.number ? `No. ${doc.number}` : "Project", href: `/work/${doc?.slug || ""}` },
              ],
            }),
          }),
        },
      },
    }),
    visionTool(),
    colorInput(),
  ],
});
