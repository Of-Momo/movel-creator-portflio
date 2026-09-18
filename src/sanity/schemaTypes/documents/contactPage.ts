import { defineType } from "sanity";
import { sectionsField } from "../objects/sectionsArray";

export default defineType({
  name: "contactPage",
  title: "Contact",
  type: "document",
  fields: [sectionsField, { name: "seo", title: "SEO + sharing", type: "seoFields" }],
  preview: { prepare: () => ({ title: "Contact" }) },
});
