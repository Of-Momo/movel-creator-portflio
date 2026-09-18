import { defineField, defineType } from "sanity";

export default defineType({
  name: "contactSettings",
  title: "Contact Form Settings",
  type: "document",
  fields: [
    defineField({ name: "whatsappNumber", title: "Business WhatsApp number", type: "string", description: "With country code, e.g. +2348012345678. No spaces or dashes." }),
    defineField({ name: "email", title: "Contact email", type: "string" }),
    defineField({ name: "responseTimeHours", title: "Promised response time (hours)", type: "number", initialValue: 48 }),
    defineField({
      name: "labels",
      title: "Field labels",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name field label", type: "string", initialValue: "Name" }),
        defineField({ name: "brand", title: "Brand field label", type: "string", initialValue: "Brand" }),
        defineField({ name: "contact", title: "Email/WhatsApp field label", type: "string", initialValue: "Email or WhatsApp" }),
        defineField({ name: "service", title: "Service field label", type: "string", initialValue: "Service" }),
        defineField({ name: "videos", title: "Videos field label", type: "string", initialValue: "How many videos" }),
        defineField({ name: "platforms", title: "Platforms field label", type: "string", initialValue: "Platforms" }),
        defineField({ name: "timeline", title: "Timeline field label", type: "string", initialValue: "Timeline" }),
        defineField({ name: "message", title: "Message field label", type: "string", initialValue: "Short message about the project" }),
        defineField({ name: "budget", title: "Budget field label", type: "string", initialValue: "Budget in mind" }),
      ],
    }),
    defineField({
      name: "serviceOptions",
      title: "Service options",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["On camera", "Behind the camera", "Both"],
    }),
    defineField({
      name: "platformOptions",
      title: "Platform options",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["Instagram", "TikTok", "YouTube", "LinkedIn", "Other"],
    }),
    defineField({
      name: "autoReply",
      title: "Auto-reply email to the brand",
      type: "object",
      fields: [
        defineField({ name: "subject", title: "Subject", type: "string", initialValue: "Got it. Your brief is with Mo." }),
        defineField({ name: "body", title: "Body", type: "text", rows: 6 }),
      ],
    }),
    defineField({
      name: "notifySubjectTemplate",
      title: "Notification email subject (to Mo)",
      type: "string",
      description: "Use {brand} and {service} as placeholders.",
      initialValue: "New enquiry: {brand} ({service})",
    }),
    defineField({
      name: "thankYou",
      title: "Thank-you screen",
      type: "object",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Got it. Your brief is in." }),
        defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
        defineField({ name: "buttonLabel", title: "Button label", type: "string", initialValue: "Back to the work" }),
      ],
    }),
    defineField({
      name: "whatsappTemplate",
      title: "WhatsApp pre-filled message template",
      type: "text",
      rows: 12,
      description: "Placeholders: {name} {brand} {contact} {service} {videos} {platforms} {timeline} {budget} {message}",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact Form Settings" }) },
});
