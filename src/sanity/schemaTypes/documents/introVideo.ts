import { defineField, defineType } from "sanity";

export default defineType({
  name: "introVideo",
  title: "Intro Video",
  type: "document",
  fields: [
    defineField({
      name: "video",
      title: "Video (vertical, 9:16)",
      type: "file",
      options: { accept: "video/mp4" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "Poster image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({
      name: "captionsFile",
      title: "Captions (.vtt, optional)",
      type: "file",
      options: { accept: ".vtt" },
    }),
  ],
  preview: {
    select: { media: "poster" },
    prepare: ({ media }) => ({ title: "Intro Video", media }),
  },
});
