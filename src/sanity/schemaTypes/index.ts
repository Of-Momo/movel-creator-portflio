import project from "./documents/project";
import brand from "./documents/brand";
import faq from "./documents/faq";
import introVideo from "./documents/introVideo";
import social from "./documents/social";
import contactSettings from "./documents/contactSettings";
import siteStyle from "./documents/siteStyle";
import siteSettings from "./documents/siteSettings";
import homePage from "./documents/homePage";
import aboutPage from "./documents/aboutPage";
import workPage from "./documents/workPage";
import contactPage from "./documents/contactPage";

import seoFields from "./objects/seoFields";
import presetManager from "./objects/presetManager";
import { richTextObjects } from "./objects/richTextBody";

import sectionCover from "./objects/sectionCover";
import sectionIntroVideo from "./objects/sectionIntroVideo";
import sectionServicesSpread from "./objects/sectionServicesSpread";
import sectionFeaturedWork from "./objects/sectionFeaturedWork";
import sectionBrandStrip from "./objects/sectionBrandStrip";
import sectionPullQuote from "./objects/sectionPullQuote";
import sectionQuickAnswers from "./objects/sectionQuickAnswers";
import sectionFullFaq from "./objects/sectionFullFaq";
import sectionClosingLine from "./objects/sectionClosingLine";
import sectionRichText from "./objects/sectionRichText";
import sectionPhotoText from "./objects/sectionPhotoText";
import sectionBtsGallery from "./objects/sectionBtsGallery";
import sectionContactForm from "./objects/sectionContactForm";
import sectionReasoningGallery from "./objects/sectionReasoningGallery";
import sectionPricing from "./objects/sectionPricing";

export const schemaTypes = [
  // documents
  project, brand, faq, introVideo, social, contactSettings, siteStyle, siteSettings,
  homePage, aboutPage, workPage, contactPage,
  // shared objects
  seoFields, presetManager, ...richTextObjects,
  // section library
  sectionCover, sectionIntroVideo, sectionServicesSpread, sectionFeaturedWork,
  sectionBrandStrip, sectionPullQuote, sectionQuickAnswers, sectionFullFaq,
  sectionClosingLine, sectionRichText, sectionPhotoText, sectionBtsGallery,
  sectionContactForm, sectionReasoningGallery, sectionPricing,
];
