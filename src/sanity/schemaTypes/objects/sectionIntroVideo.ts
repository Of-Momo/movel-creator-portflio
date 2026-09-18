import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionIntroVideo",
  title: "Intro video",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      initialValue: "The Intro",
    }),
    defineField({
      name: "sideText",
      title: "Text beside the video (desktop)",
      type: "text",
      rows: 3,
    }),
  ],
  description: "Plays the video from the Intro Video collection. Autoplays once, muted, the first time it scrolls into view.",
  preview: {
    select: { title: "label" },
    prepare: ({ title }) => ({ title: `Intro video — ${title || "The Intro"}` }),
  },
});
