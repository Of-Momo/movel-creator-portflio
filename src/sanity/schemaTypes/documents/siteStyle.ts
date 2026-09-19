import { defineField, defineType } from "sanity";
import { HEADLINE_FONTS, BODY_FONTS, SIGNATURE_FONTS } from "@/lib/themeConstants";

export { HEADLINE_FONTS, BODY_FONTS, SIGNATURE_FONTS, DEFAULT_THEME } from "@/lib/themeConstants";

const colorField = (name: string, title: string) =>
  defineField({ name, title, type: "color", options: { disableAlpha: true } });

export default defineType({
  name: "siteStyle",
  title: "Site Style",
  type: "document",
  fields: [
    defineField({
      name: "presetManager",
      title: "Themes",
      type: "presetManager",
      description: "Save the current look as a named preset, or switch to a saved one.",
    }),
    defineField({
      name: "colors",
      title: "Colours",
      type: "object",
      fields: [
        colorField("paper", "Paper — main background"),
        colorField("ink", "Ink — text, dark sections"),
        colorField("accent", "Accent — links, buttons, Mo's name"),
        colorField("soft", "Soft — quote backgrounds, highlights"),
        colorField("detail", "Detail — thin rules, issue numbers (decorative only)"),
      ],
    }),
    defineField({
      name: "fonts",
      title: "Fonts",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline font", type: "string", options: { list: HEADLINE_FONTS } }),
        defineField({ name: "body", title: "Body font", type: "string", options: { list: BODY_FONTS } }),
        defineField({ name: "signature", title: "Signature font", type: "string", options: { list: SIGNATURE_FONTS } }),
      ],
    }),
    defineField({
      name: "presets",
      title: "Saved presets",
      type: "array",
      of: [
        {
          type: "object",
          name: "themePreset",
          fields: [
            defineField({ name: "name", title: "Name", type: "string" }),
            defineField({
              name: "colors",
              title: "Colours",
              type: "object",
              fields: [
                colorField("paper", "Paper"),
                colorField("ink", "Ink"),
                colorField("accent", "Accent"),
                colorField("soft", "Soft"),
                colorField("detail", "Detail"),
              ],
            }),
            defineField({
              name: "fonts",
              title: "Fonts",
              type: "object",
              fields: [
                defineField({ name: "headline", title: "Headline", type: "string" }),
                defineField({ name: "body", title: "Body", type: "string" }),
                defineField({ name: "signature", title: "Signature", type: "string" }),
              ],
            }),
          ],
          preview: { select: { title: "name" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Style" }) },
});
