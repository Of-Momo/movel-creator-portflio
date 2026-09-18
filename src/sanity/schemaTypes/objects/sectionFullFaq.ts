import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionFullFaq",
  title: "Full FAQ",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "The Practical Bits" }),
  ],
  description: 'Pulls FAQ items marked "Show on About", in order.',
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Full FAQ — ${title || "The Practical Bits"}` }),
  },
});
