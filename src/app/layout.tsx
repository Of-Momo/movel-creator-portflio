import type { Metadata } from "next";
import { getIntroVideo, getSiteSettings, getSiteStyle, getSocials } from "@/sanity/lib/fetch";
import { IntroOverlayProvider } from "@/components/intro/IntroOverlayProvider";
import { urlForImage } from "@/sanity/lib/image";
import { googleFontsHref, resolveFonts, themeStyleVars } from "@/lib/theme";
import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { AnalyticsBeacon } from "@/components/ui/AnalyticsBeacon";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movelstudio.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const seo = settings?.defaultSeo;
  const title = seo?.title || "Mo | Content Creator & Director in Lagos | MOVEL";
  const description =
    seo?.description ||
    "Mo is a Lagos-based content creator and director making short-form brand video, in front of the camera or behind it, for brands in Nigeria and worldwide.";
  const shareImage = urlForImage(seo?.shareImage)?.width(1200).height(630).url();

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | MOVEL` },
    description,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: "MOVEL",
      images: shareImage ? [{ url: shareImage, width: 1200, height: 630 }] : undefined,
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: shareImage ? [shareImage] : undefined,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [style, settings, socials, intro] = await Promise.all([
    getSiteStyle(),
    getSiteSettings(),
    getSocials(),
    getIntroVideo(),
  ]);
  const fonts = resolveFonts(style?.fonts);
  const styleVars = themeStyleVars(style);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings?.ownerName || "Mo",
    jobTitle: settings?.role || "Content Creator & Director",
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    url: SITE_URL,
  };
  const businessLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "MOVEL",
    founder: settings?.ownerName || "Mo",
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
    url: SITE_URL,
    makesOffer: (settings?.servicesSummary || []).map((s: string) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", description: s },
    })),
  };

  return (
    <html lang="en" style={styleVars}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={googleFontsHref(fonts)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessLd) }}
        />
      </head>
      <body className="font-body antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <IntroOverlayProvider intro={intro}>
          <Nav />
          <main id="main">{children}</main>
          <Footer socials={socials} />
        </IntroOverlayProvider>
        <AnalyticsBeacon />
      </body>
    </html>
  );
}
