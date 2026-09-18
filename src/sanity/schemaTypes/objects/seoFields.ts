import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoFields",
  title: "SEO + sharing",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      description: "Shown in the browser tab and Google search results.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Shown under the title in Google, and in link previews.",
    }),
    defineField({
      name: "shareImage",
      title: "Share image",
      type: "image",
      description: "Shown when this page's link is pasted into WhatsApp, Instagram, LinkedIn or X.",
    }),
  ],
});
