import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "business", title: "Business info" },
    { name: "seo", title: "Default SEO" },
    { name: "assistant", title: "Assistant access" },
  ],
  fields: [
    defineField({ group: "business", name: "siteName", title: "Site name", type: "string", initialValue: "MOVEL" }),
    defineField({ group: "business", name: "ownerName", title: "Owner's name", type: "string", initialValue: "Mo" }),
    defineField({ group: "business", name: "role", title: "Role", type: "string", initialValue: "Content Creator & Director" }),
    defineField({ group: "business", name: "location", title: "Location", type: "string", initialValue: "Lagos, Nigeria" }),
    defineField({
      group: "business",
      name: "servicesSummary",
      title: "Services summary (for AI + structured data)",
      type: "array",
      of: [{ type: "string" }],
      initialValue: [
        "In front of the camera: Mo writes the script and performs on camera as the brand's face.",
        "Behind the camera: Mo scripts and directs a brand's own founders, staff or talent on camera.",
        "Editing available as an add-on.",
      ],
    }),
    defineField({
      group: "seo",
      name: "defaultSeo",
      title: "Default SEO + sharing",
      type: "seoFields",
    }),
    defineField({
      group: "assistant",
      name: "assistantAccessEnabled",
      title: "Allow assistant access to /post",
      type: "boolean",
      initialValue: false,
      description: "When on, the emails below can log into /post to upload videos and write captions. Everything they submit is saved as a draft — nothing goes live until Mo reviews and publishes it. They never see the full Studio.",
    }),
    defineField({
      group: "assistant",
      name: "assistantEmails",
      title: "Assistant Google emails",
      type: "array",
      of: [{ type: "string" }],
      hidden: ({ document }) => !document?.assistantAccessEnabled,
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
