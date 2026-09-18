import { defineField } from "sanity";

export const SECTION_TYPES = [
  "sectionCover",
  "sectionIntroVideo",
  "sectionServicesSpread",
  "sectionFeaturedWork",
  "sectionBrandStrip",
  "sectionPullQuote",
  "sectionQuickAnswers",
  "sectionFullFaq",
  "sectionClosingLine",
  "sectionRichText",
  "sectionPhotoText",
  "sectionBtsGallery",
  "sectionContactForm",
  "sectionReasoningGallery",
  "sectionPricing",
] as const;

export const sectionsField = defineField({
  name: "sections",
  title: "Sections",
  type: "array",
  description: "Switch sections on/off, drag to reorder, duplicate or delete, and add new ones from the library.",
  of: SECTION_TYPES.map((name) => ({ type: name })),
});
