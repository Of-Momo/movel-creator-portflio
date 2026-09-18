import { defineField, defineType } from "sanity";
import { sectionBaseFields } from "./sectionBase";

export default defineType({
  name: "sectionBtsGallery",
  title: "BTS gallery (looping clips)",
  type: "object",
  fields: [
    ...sectionBaseFields,
    defineField({ name: "heading", title: "Heading", type: "string", initialValue: "Behind the scenes" }),
    defineField({
      name: "clips",
      title: "Clips",
      type: "array",
      of: [{ type: "blockBtsClip" }],
    }),
  ],
  preview: {
    select: { title: "heading", clips: "clips" },
    prepare: ({ title, clips }) => ({ title: `BTS gallery — ${title || ""}`, subtitle: `${clips?.length || 0} clips` }),
  },
});
