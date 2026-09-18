import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionBrandStrip",
  title: "Brand strip",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Brands I've created for" }),
  ],
  description: 'Pulls every brand marked "Show on site" from the Brands list. Logos are automatically recoloured to match the section background.',
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Brand strip — ${title || "Brands I've created for"}` }),
  },
});
