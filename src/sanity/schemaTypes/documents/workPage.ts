import { defineField, defineType } from "sanity";
import { sectionsField } from "../objects/sectionsArray";

export default defineType({
  name: "workPage",
  title: "Work",
  type: "document",
  description: "The grid pulls every project automatically, in their set order. Sections added below appear underneath the grid.",
  fields: [
    defineField({ name: "heading", title: "Grid heading", type: "string", initialValue: "The Work" }),
    defineField({ name: "subline", title: "Grid subline", type: "string", initialValue: "Tap anything. Swipe through everything." }),
    sectionsField,
    { name: "seo", title: "SEO + sharing", type: "seoFields" },
  ],
  preview: { prepare: () => ({ title: "Work" }) },
});
