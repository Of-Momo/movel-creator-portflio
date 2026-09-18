import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionClosingLine",
  title: "Closing line + button",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "line", title: "Line", type: "string", validation: (r) => r.required() }),
    defineField({ name: "buttonLabel", title: "Button label", type: "string", initialValue: "Work with Mo" }),
    defineField({
      name: "buttonLink",
      title: "Button goes to",
      type: "string",
      options: { list: [{ title: "Contact", value: "/contact" }, { title: "Work", value: "/work" }, { title: "About", value: "/about" }] },
      initialValue: "/contact",
    }),
  ],
  preview: {
    select: { title: "line" },
    prepare: ({ title }) => ({ title: `Closing line — ${title || ""}` }),
  },
});
