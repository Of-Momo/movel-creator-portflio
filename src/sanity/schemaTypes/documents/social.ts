import { defineField, defineType } from "sanity";

export default defineType({
  name: "social",
  title: "Social link",
  type: "document",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: ["Instagram", "TikTok", "LinkedIn", "YouTube", "X"] },
      validation: (r) => r.required(),
    }),
    defineField({ name: "handle", title: "Handle", type: "string" }),
    defineField({ name: "url", title: "URL", type: "url", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "platform", subtitle: "handle" },
  },
});
