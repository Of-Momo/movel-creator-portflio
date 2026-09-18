import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionQuickAnswers",
  title: "Quick answers",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Quick answers" }),
    defineField({ name: "linkLabel", title: "Link label", type: "string", initialValue: "More answers →" }),
  ],
  description: 'Pulls FAQ items marked "Show on homepage", tap to expand.',
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Quick answers — ${title || "Quick answers"}` }),
  },
});
