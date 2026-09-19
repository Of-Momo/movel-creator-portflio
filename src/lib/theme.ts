import type { SiteStyle, ThemeColors, ThemeFonts } from "./types";
import { DEFAULT_THEME } from "@/lib/themeConstants";

const GOOGLE_FONT_SPECS: Record<string, string> = {
  // headline serifs
  "Bodoni Moda": "Bodoni+Moda:ital,wght@0,400;0,500;0,700;1,400;1,600",
  "Playfair Display": "Playfair+Display:ital,wght@0,400;0,700;1,400;1,600",
  "DM Serif Display": "DM+Serif+Display:ital,wght@0,400;1,400",
  "Cormorant Garamond": "Cormorant+Garamond:ital,wght@0,400;0,600;1,400",
  Fraunces: "Fraunces:ital,wght@0,400;0,600;1,400",
  "Libre Caslon Display": "Libre+Caslon+Display",
  Gloock: "Gloock",
  Italiana: "Italiana",
  "Instrument Serif": "Instrument+Serif:ital@0;1",
  Newsreader: "Newsreader:ital,wght@0,400;0,600;1,400",
  Spectral: "Spectral:ital,wght@0,400;0,600;1,400",
  Domine: "Domine:wght@400;600;700",
  // body sans
  "DM Sans": "DM+Sans:wght@400;500;700",
  Manrope: "Manrope:wght@400;500;700",
  Outfit: "Outfit:wght@400;500;700",
  "Work Sans": "Work+Sans:wght@400;500;700",
  Karla: "Karla:wght@400;500;700",
  Inter: "Inter:wght@400;500;700",
  "Space Grotesk": "Space+Grotesk:wght@400;500;700",
  Sora: "Sora:wght@400;500;700",
  "Plus Jakarta Sans": "Plus+Jakarta+Sans:wght@400;500;700",
  Urbanist: "Urbanist:wght@400;500;700",
  // signature
  "Pinyon Script": "Pinyon+Script",
  "Great Vibes": "Great+Vibes",
  Allura: "Allura",
  "Dancing Script": "Dancing+Script:wght@400;700",
  Sacramento: "Sacramento",
  Parisienne: "Parisienne",
};

export function googleFontsHref(fonts: ThemeFonts) {
  const families = [fonts.headline, fonts.body, fonts.signature]
    .filter((f): f is string => Boolean(f))
    .map((f) => GOOGLE_FONT_SPECS[f] || f.replace(/ /g, "+"));
  const unique = Array.from(new Set(families));
  const query = unique.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

export function allFontOptionsHref() {
  const families = Object.values(GOOGLE_FONT_SPECS);
  const query = families.map((f) => `family=${f}`).join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

export function resolveColors(colors?: ThemeColors): Required<{ [K in keyof ThemeColors]: string }> {
  const d = DEFAULT_THEME.colors;
  return {
    paper: colors?.paper?.hex || d.paper.hex,
    ink: colors?.ink?.hex || d.ink.hex,
    accent: colors?.accent?.hex || d.accent.hex,
    soft: colors?.soft?.hex || d.soft.hex,
    detail: colors?.detail?.hex || d.detail.hex,
  } as any;
}

export function resolveFonts(fonts?: ThemeFonts): Required<ThemeFonts> {
  const d = DEFAULT_THEME.fonts;
  return {
    headline: fonts?.headline || d.headline,
    body: fonts?.body || d.body,
    signature: fonts?.signature || d.signature,
  };
}

export function themeStyleVars(style?: SiteStyle | null): React.CSSProperties {
  const colors = resolveColors(style?.colors);
  const fonts = resolveFonts(style?.fonts);
  return {
    "--paper": colors.paper,
    "--ink": colors.ink,
    "--accent": colors.accent,
    "--soft": colors.soft,
    "--detail": colors.detail,
    "--font-headline": `"${fonts.headline}", serif`,
    "--font-body": `"${fonts.body}", sans-serif`,
    "--font-signature": `"${fonts.signature}", cursive`,
  } as React.CSSProperties;
}
