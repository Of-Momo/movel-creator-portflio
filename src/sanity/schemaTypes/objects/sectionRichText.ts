import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionRichText",
  title: "Rich text",
  type: "object",
  description: "A blog-style editor. Used for the Editor's Letter. Bold, italics, links, photos, BTS clips, pull quotes, icons and logo rows can all be dropped in between paragraphs.",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading (optional)", type: "string" }),
    defineField({ name: "body", title: "Body", type: "richTextBody" }),
    defineField({
      name: "signatureText",
      title: "Signature sign-off (Pinyon Script)",
      type: "string",
      description: 'e.g. "Mo" — rendered in the signature font at the end.',
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Rich text — ${title || "Untitled"}` }),
  },
});
