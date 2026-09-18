import { defineType } from "sanity";
import { sectionsField } from "../objects/sectionsArray";

export default defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [sectionsField, { name: "seo", title: "SEO + sharing", type: "seoFields" }],
  preview: { prepare: () => ({ title: "Homepage" }) },
});
