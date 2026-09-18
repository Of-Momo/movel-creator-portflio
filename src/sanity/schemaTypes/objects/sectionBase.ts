import type { FieldDefinition } from "sanity";

export const backgroundField: FieldDefinition = {
  name: "background",
  title: "Background",
  type: "string",
  description: "Which theme colour this section sits on.",
  options: {
    list: [
      { title: "Paper (cream)", value: "paper" },
      { title: "Ink (dark / lights down)", value: "ink" },
      { title: "Soft (blush)", value: "soft" },
    ],
    layout: "radio",
  },
  initialValue: "paper",
};

export const enabledField: FieldDefinition = {
  name: "enabled",
  title: "Show this section",
  type: "boolean",
  description: "Switch off to hide this section without deleting it.",
  initialValue: true,
};

export const sectionBaseFields = [enabledField, backgroundField];
