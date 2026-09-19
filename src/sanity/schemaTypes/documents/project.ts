import { defineField, defineType } from "sanity";
import { orderRankField, orderRankOrdering } from "@sanity/orderable-document-list";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: "project", newItemPosition: "before" }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      options: { accept: "video/mp4" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "brand",
      title: "Brand",
      type: "reference",
      to: [{ type: "brand" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the video's own URL: movelstudio.com/work/[slug]",
      options: { maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "number",
      title: "Issue number",
      type: "number",
      description: 'Shown as "No. 01" etc. Also controls the default grid order (lower first).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 6,
      description: 'The first 3 lines show in the feed. Add "---" on its own line to mark where "more" expands. Add a final line "Watch my reasoning →" is added automatically if a reasoning video is attached.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "reasoningVideo",
      title: "Reasoning video (optional)",
      type: "file",
      options: { accept: "video/mp4" },
      description: "Plays as an overlay on top of the feed when the visitor taps \"Watch my reasoning →\". Never appears in the main feed.",
    }),
    defineField({
      name: "showOnHomepage",
      title: "Show on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "orientation",
      title: "Orientation",
      type: "string",
      options: { list: [{ title: "Vertical (9:16)", value: "vertical" }, { title: "Horizontal (16:9)", value: "horizontal" }] },
      initialValue: "vertical",
      description: "Auto-detected on upload from /post. Change it here if it looks wrong.",
    }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "caption", number: "number", media: "thumbnail", brand: "brand.name" },
    prepare: ({ title, number, media, brand }) => ({
      title: `No. ${String(number).padStart(2, "0")} · ${brand || "No brand"}`,
      subtitle: title,
      media,
    }),
  },
});
