import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionFeaturedWork",
  title: "Featured work",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "The Work" }),
    defineField({ name: "subline", title: "Subline", type: "string" }),
    defineField({
      name: "maxItems",
      title: "How many projects to show",
      type: "number",
      initialValue: 3,
      validation: (r) => r.min(1).max(6),
    }),
    defineField({ name: "linkLabel", title: 'Link label ("See all work →")', type: "string", initialValue: "See all work →" }),
  ],
  description: 'Automatically pulls projects marked "Show on homepage", in their set order.',
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Featured work — ${title || "The Work"}` }),
  },
});
