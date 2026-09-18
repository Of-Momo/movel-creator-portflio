import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", validation: (r) => r.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "showOnHomepage", title: "Show on homepage", type: "boolean", initialValue: false }),
    defineField({ name: "showOnAbout", title: "Show on About", type: "boolean", initialValue: true }),
    defineField({ name: "order", title: "Order", type: "number", initialValue: 0 }),
  ],
  orderings: [{ title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "question", homepage: "showOnHomepage", about: "showOnAbout" },
    prepare: ({ title, homepage, about }) => ({
      title,
      subtitle: [homepage && "Homepage", about && "About"].filter(Boolean).join(" · ") || "Hidden",
    }),
  },
});
