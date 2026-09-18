import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionCover",
  title: "Cover",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({
      name: "masthead",
      title: "Masthead",
      type: "string",
      description: 'The big title across the top, e.g. "MOVEL".',
      initialValue: "MOVEL",
    }),
    defineField({
      name: "issueLine",
      title: "Issue line",
      type: "string",
      description: 'Small line near the masthead, e.g. "No. 01 · Lagos".',
    }),
    defineField({
      name: "coverStar",
      title: "Cover star name",
      type: "string",
    }),
    defineField({
      name: "coverLines",
      title: "Cover lines",
      description: "The short lines of text around Mo on the cover, in order.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "introLinkLineIndex",
      title: "Which cover line links to the intro?",
      description: 'The number of the cover line (starting at 1) that should act as "Watch the intro →", scrolling to the intro section and playing it. Leave blank for none.',
      type: "number",
    }),
    defineField({
      name: "imageMobile",
      title: "Cover photo — mobile (vertical)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cutoutMobile",
      title: "Mo cutout — mobile (transparent PNG)",
      description: "A transparent cutout of Mo, placed in front of the masthead for the depth effect.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "imageDesktop",
      title: "Cover photo — desktop (horizontal)",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "cutoutDesktop",
      title: "Mo cutout — desktop (transparent PNG)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "livingCoverEnabled",
      title: "Living cover (looping video instead of a photo)",
      type: "boolean",
      initialValue: false,
      description: "Off by default. Turn on once you have a short (2-3s) muted looping video to use instead of the still cover photo.",
    }),
    defineField({
      name: "livingCoverVideoMobile",
      title: "Living cover video — mobile",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => !parent?.livingCoverEnabled,
    }),
    defineField({
      name: "livingCoverVideoDesktop",
      title: "Living cover video — desktop",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => !parent?.livingCoverEnabled,
    }),
  ],
  preview: {
    select: { title: "masthead", media: "imageMobile" },
    prepare: ({ title, media }) => ({ title: `Cover — ${title || "Untitled"}`, media }),
  },
});
