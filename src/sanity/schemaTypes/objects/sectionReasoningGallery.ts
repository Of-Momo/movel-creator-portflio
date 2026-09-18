import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionReasoningGallery",
  title: "Reasoning gallery",
  type: "object",
  description: "Built for later: a gallery of every project's reasoning video. Not placed on any page by default.",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "How I think about it" }),
    defineField({ name: "subline", title: "Subline", type: "string" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Reasoning gallery — ${title || ""}` }),
  },
});
