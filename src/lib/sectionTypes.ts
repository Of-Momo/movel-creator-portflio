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

export type SectionType = (typeof SECTION_TYPES)[number];

export const SECTION_LABELS: Record<SectionType, string> = {
  sectionCover: "Cover",
  sectionIntroVideo: "Intro video",
  sectionServicesSpread: "Services spread",
  sectionFeaturedWork: "Featured work",
  sectionBrandStrip: "Brand strip",
  sectionPullQuote: "Pull quote",
  sectionQuickAnswers: "Quick answers",
  sectionFullFaq: "Full FAQ",
  sectionClosingLine: "Closing line + button",
  sectionRichText: "Rich text",
  sectionPhotoText: "Photo + text",
  sectionBtsGallery: "BTS gallery (looping clips)",
  sectionContactForm: "Contact form",
  sectionReasoningGallery: "Reasoning gallery",
  sectionPricing: "Starting-from pricing",
};

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function defaultSectionFor(type: SectionType): Record<string, unknown> {
  const base = { _key: randomKey(), _type: type, enabled: true, background: "paper" };
  switch (type) {
    case "sectionCover":
      return { ...base, masthead: "MOVEL", issueLine: "", coverStar: "", coverLines: [] };
    case "sectionIntroVideo":
      return { ...base, label: "The Intro", sideText: "" };
    case "sectionServicesSpread":
      return {
        ...base,
        sectionLabel: "What I Make",
        leftPage: { heading: "", intro: "", included: [] },
        rightPage: { heading: "", intro: "", included: [] },
      };
    case "sectionFeaturedWork":
      return { ...base, heading: "The Work", subline: "", maxItems: 3, linkLabel: "See all work →" };
    case "sectionBrandStrip":
      return { ...base, heading: "Brands I've created for" };
    case "sectionPullQuote":
      return { ...base, quote: "", name: "", role: "" };
    case "sectionQuickAnswers":
      return { ...base, heading: "Quick answers", linkLabel: "More answers →" };
    case "sectionFullFaq":
      return { ...base, heading: "The Practical Bits" };
    case "sectionClosingLine":
      return { ...base, line: "", buttonLabel: "Work with Mo", buttonLink: "/contact" };
    case "sectionRichText":
      return { ...base, heading: "", body: [], signatureText: "" };
    case "sectionPhotoText":
      return { ...base, heading: "", text: "", imageSide: "left" };
    case "sectionBtsGallery":
      return { ...base, heading: "Behind the scenes", clips: [] };
    case "sectionContactForm":
      return { ...base, heading: "Let's make yours.", subline: "" };
    case "sectionReasoningGallery":
      return { ...base, heading: "How I think about it", subline: "" };
    case "sectionPricing":
      return { ...base, heading: "Starting from", rows: [] };
  }
}
