import { defineField } from "sanity";
import { SECTION_TYPES } from "@/lib/sectionTypes";

export { SECTION_TYPES };

export const sectionsField = defineField({
  name: "sections",
  title: "Sections",
  type: "array",
  description: "Switch sections on/off, drag to reorder, duplicate or delete, and add new ones from the library.",
  of: SECTION_TYPES.map((name) => ({ type: name })),
});
