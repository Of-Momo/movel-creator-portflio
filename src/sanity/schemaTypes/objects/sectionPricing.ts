import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionPricing",
  title: "Starting-from pricing",
  type: "object",
  description: 'Built for later: "Starting from ₦___ / $___" per service. Not placed on any page by default.',
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Starting from" }),
    defineField({
      name: "rows",
      title: "Services",
      type: "array",
      of: [
        {
          type: "object",
          name: "pricingRow",
          fields: [
            defineField({ name: "service", title: "Service", type: "string" }),
            defineField({ name: "priceNaira", title: "Price (₦)", type: "string" }),
            defineField({ name: "priceDollar", title: "Price ($)", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title: `Starting-from pricing — ${title || ""}` }),
  },
});
