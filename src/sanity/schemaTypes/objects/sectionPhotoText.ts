import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionPhotoText",
  title: "Photo + text",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }],
    }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "text", title: "Text", type: "text", rows: 5 }),
    defineField({
      name: "imageSide",
      title: "Image side (desktop)",
      type: "string",
      options: { list: [{ title: "Left", value: "left" }, { title: "Right", value: "right" }] },
      initialValue: "left",
    }),
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({ title: `Photo + text — ${title || ""}`, media }),
  },
});
