import { defineField, defineType } from "sanity";

export default defineType({
  name: "brand",
  title: "Brand",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Transparent PNG or SVG works best — it will be recoloured automatically to match the site.",
    }),
    defineField({
      name: "showOnSite",
      title: "Show on site",
      type: "boolean",
      initialValue: true,
      description: "Appears in the homepage brand strip, About page, and as the avatar in the reel feed.",
    }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder",
      type: "boolean",
      initialValue: false,
      description: "Marks this as seed/placeholder content so Mo can find and replace it.",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo", showOnSite: "showOnSite" },
    prepare: ({ title, media, showOnSite }) => ({
      title,
      subtitle: showOnSite ? "On site" : "Hidden",
      media,
    }),
  },
});
