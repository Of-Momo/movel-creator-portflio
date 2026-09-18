import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionPullQuote",
  title: "Pull quote",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "quote", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "role", title: "Role / brand", type: "string" }),
  ],
  preview: {
    select: { title: "quote", name: "name" },
    prepare: ({ title, name }) => ({ title: `Pull quote — ${name || "unattributed"}`, subtitle: title }),
  },
});
