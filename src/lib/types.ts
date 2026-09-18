import type { Image } from "sanity";

export interface SanityFileAsset {
  asset?: { _ref: string; _type: "reference" };
}

export interface SanityImage extends Image {
  alt?: string;
  caption?: string;
}

export interface Brand {
  _id: string;
  name: string;
  logo?: SanityImage;
  showOnSite?: boolean;
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  showOnHomepage?: boolean;
  showOnAbout?: boolean;
  order?: number;
}

export interface Social {
  _id: string;
  platform: string;
  handle?: string;
  url: string;
}

export interface Project {
  _id: string;
  number: number;
  slug: { current: string };
  caption: string;
  thumbnail: SanityImage;
  video?: SanityFileAsset;
  reasoningVideo?: SanityFileAsset;
  orientation: "vertical" | "horizontal";
  brand?: Brand;
  hasReasoning?: boolean;
  showOnHomepage?: boolean;
  order?: number;
}

export interface IntroVideo {
  video?: SanityFileAsset;
  poster?: SanityImage;
  captionsFile?: SanityFileAsset;
}

export interface ThemeColors {
  paper?: { hex: string };
  ink?: { hex: string };
  accent?: { hex: string };
  soft?: { hex: string };
  detail?: { hex: string };
}

export interface ThemeFonts {
  headline?: string;
  body?: string;
  signature?: string;
}

export interface SiteStyle {
  colors?: ThemeColors;
  fonts?: ThemeFonts;
  presets?: { _key: string; name: string; colors: ThemeColors; fonts: ThemeFonts }[];
}

export interface SiteSettings {
  siteName?: string;
  ownerName?: string;
  role?: string;
  location?: string;
  servicesSummary?: string[];
  defaultSeo?: SeoFields;
  assistantAccessEnabled?: boolean;
  assistantEmails?: string[];
}

export interface ContactSettings {
  whatsappNumber?: string;
  email?: string;
  responseTimeHours?: number;
  labels?: Record<string, string>;
  serviceOptions?: string[];
  platformOptions?: string[];
  autoReply?: { subject?: string; body?: string };
  notifySubjectTemplate?: string;
  thankYou?: { heading?: string; body?: string; buttonLabel?: string };
  whatsappTemplate?: string;
}

export interface SeoFields {
  title?: string;
  description?: string;
  shareImage?: SanityImage;
}

export interface Section {
  _key: string;
  _type: string;
  enabled?: boolean;
  background?: "paper" | "ink" | "soft";
  [key: string]: unknown;
}

export interface PageDoc {
  sections?: Section[];
  seo?: SeoFields;
  heading?: string;
  subline?: string;
}
