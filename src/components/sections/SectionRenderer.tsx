import type { ContactSettings, IntroVideo, Section } from "@/lib/types";
import { SectionShell } from "@/components/ui/SectionShell";
import { CoverSection } from "./CoverSection";
import { IntroVideoSection } from "./IntroVideoSection";
import { ServicesSpreadSection } from "./ServicesSpreadSection";
import { FeaturedWorkSection } from "./FeaturedWorkSection";
import { BrandStripSection } from "./BrandStripSection";
import { PullQuoteSection } from "./PullQuoteSection";
import { QuickAnswersSection } from "./QuickAnswersSection";
import { FullFaqSection } from "./FullFaqSection";
import { ClosingLineSection } from "./ClosingLineSection";
import { RichTextSection } from "./RichTextSection";
import { PhotoTextSection } from "./PhotoTextSection";
import { BtsGallerySection } from "./BtsGallerySection";
import { ContactFormSection } from "./ContactFormSection";
import { ReasoningGallerySection } from "./ReasoningGallerySection";
import { PricingSection } from "./PricingSection";

export function SectionRenderer({
  sections,
  intro,
  contactSettings,
}: {
  sections?: Section[];
  intro?: IntroVideo | null;
  contactSettings?: ContactSettings | null;
}) {
  const visible = (sections || []).filter((s) => s.enabled !== false);

  return (
    <>
      {visible.map((section) => {
        if (section._type === "sectionCover") {
          return <CoverSection key={section._key} data={section} />;
        }
        return (
          <SectionShell key={section._key} background={section.background}>
            {renderInner(section, { intro, contactSettings })}
          </SectionShell>
        );
      })}
    </>
  );
}

function renderInner(
  section: Section,
  extra: { intro?: IntroVideo | null; contactSettings?: ContactSettings | null }
) {
  switch (section._type) {
    case "sectionIntroVideo":
      return <IntroVideoSection data={section} intro={extra.intro ?? null} />;
    case "sectionServicesSpread":
      return <ServicesSpreadSection data={section} />;
    case "sectionFeaturedWork":
      return <FeaturedWorkSection data={section as any} />;
    case "sectionBrandStrip":
      return <BrandStripSection data={section as any} />;
    case "sectionPullQuote":
      return <PullQuoteSection data={section} />;
    case "sectionQuickAnswers":
      return <QuickAnswersSection data={section as any} />;
    case "sectionFullFaq":
      return <FullFaqSection data={section as any} />;
    case "sectionClosingLine":
      return <ClosingLineSection data={section} />;
    case "sectionRichText":
      return <RichTextSection data={section} />;
    case "sectionPhotoText":
      return <PhotoTextSection data={section} />;
    case "sectionBtsGallery":
      return <BtsGallerySection data={section} />;
    case "sectionContactForm":
      return <ContactFormSection data={section} settings={extra.contactSettings ?? null} />;
    case "sectionReasoningGallery":
      return <ReasoningGallerySection data={section as any} />;
    case "sectionPricing":
      return <PricingSection data={section} />;
    default:
      return null;
  }
}
