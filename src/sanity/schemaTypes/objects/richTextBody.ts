import { defineArrayMember, defineField, defineType } from "sanity";

const ICON_OPTIONS = [
  "camera", "film-strip", "microphone", "pen-nib", "sparkle", "heart",
  "play-circle", "share-network", "map-pin", "check-circle", "star", "clock",
];

export const blockIconInline = defineType({
  name: "blockIconInline",
  title: "Icon",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "string",
      options: { list: ICON_OPTIONS.map((v) => ({ title: v, value: v })) },
      validation: (r) => r.required(),
    }),
    defineField({ name: "label", title: "Label next to icon", type: "string" }),
  ],
  preview: {
    select: { title: "label", icon: "icon" },
    prepare: ({ title, icon }) => ({ title: `Icon: ${icon}${title ? ` — ${title}` : ""}` }),
  },
});

export const blockPullQuote = defineType({
  name: "blockPullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", title: "Attribution", type: "string" }),
  ],
  preview: {
    select: { title: "quote" },
  },
});

export const blockLogoRow = defineType({
  name: "blockLogoRow",
  title: "Logo row",
  type: "object",
  fields: [
    defineField({
      name: "brands",
      title: "Brands",
      type: "array",
      of: [{ type: "reference", to: [{ type: "brand" }] }],
    }),
  ],
  preview: {
    select: { brands: "brands" },
    prepare: ({ brands }) => ({ title: `Logo row (${brands?.length || 0} brands)` }),
  },
});

export const blockBtsClip = defineType({
  name: "blockBtsClip",
  title: "BTS clip",
  type: "object",
  fields: [
    defineField({
      name: "video",
      title: "Video (silent loop, 5-10s)",
      type: "file",
      options: { accept: "video/*" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "poster", title: "Poster image", type: "image", options: { hotspot: true } }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
  preview: {
    select: { title: "caption" },
    prepare: ({ title }) => ({ title: title || "BTS clip" }),
  },
});

export const blockFigureImage = defineType({
  name: "blockFigureImage",
  title: "Photo",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
  ],
});

export const richTextBody = defineType({
  name: "richTextBody",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [{ name: "href", title: "URL", type: "url" }],
          },
          {
            name: "introLink",
            title: "Intro link (plays the intro as an overlay)",
            type: "object",
            description: "Tapping this text plays the intro video as an overlay, right on this page. No URL needed.",
            fields: [{ name: "note", title: "Internal note (optional)", type: "string" }],
          },
        ],
      },
    }),
    defineArrayMember({ type: "blockFigureImage" }),
    defineArrayMember({ type: "blockPullQuote" }),
    defineArrayMember({ type: "blockBtsClip" }),
    defineArrayMember({ type: "blockIconInline" }),
    defineArrayMember({ type: "blockLogoRow" }),
  ],
});

export const richTextObjects = [blockIconInline, blockPullQuote, blockLogoRow, blockBtsClip, blockFigureImage, richTextBody];
