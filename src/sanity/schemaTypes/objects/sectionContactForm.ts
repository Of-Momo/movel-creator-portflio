import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionContactForm",
  title: "Contact form",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Let's make yours." }),
    defineField({ name: "subline", title: "Subline", type: "text", rows: 2 }),
  ],
  description: "Renders the contact form. Field labels, options, WhatsApp number and email live in Contact Form Settings.",
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Contact form — ${title || ""}` }),
  },
});
