import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

const page = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "heading", title: "Heading", type: "string" }),
      defineField({ name: "intro", title: "Intro paragraph", type: "text", rows: 4 }),
      defineField({
        name: "included",
        title: "Included",
        type: "array",
        of: [{ type: "string" }],
      }),
    ],
  });

export default defineType({
  name: "sectionServicesSpread",
  title: "Services spread",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "sectionLabel", title: "Section label", type: "string", initialValue: "What I Make" }),
    page("leftPage", "Left page — in front of the camera"),
    page("rightPage", "Right page — behind the camera"),
  ],
  preview: {
    select: { title: "sectionLabel" },
    prepare: ({ title }) => ({ title: `Services spread — ${title || "What I Make"}` }),
  },
});
