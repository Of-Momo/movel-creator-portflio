import { groq } from "next-sanity";

const seoFragment = `seo{title, description, shareImage}`;

const sectionsFragment = `
  sections[]{
    ...,
    _type == "sectionFeaturedWork" => {
      ...,
      "projects": *[_type == "project" && showOnHomepage == true] | order(orderRank asc)[0...^.maxItems]{
        _id, number, slug, caption, thumbnail, orientation, "brand": brand->{name, logo}, "hasReasoning": defined(reasoningVideo)
      }
    },
    _type == "sectionBrandStrip" => {
      ...,
      "brands": *[_type == "brand" && showOnSite == true] | order(name asc)
    },
    _type == "sectionQuickAnswers" => {
      ...,
      "items": *[_type == "faq" && showOnHomepage == true] | order(order asc)
    },
    _type == "sectionFullFaq" => {
      ...,
      "items": *[_type == "faq" && showOnAbout == true] | order(order asc)
    },
    _type == "sectionReasoningGallery" => {
      ...,
      "projects": *[_type == "project" && defined(reasoningVideo)] | order(orderRank asc)
    },
    _type == "sectionBtsGallery" => { ... },
    _type == "sectionRichText" => {
      ...,
      body[]{
        ...,
        _type == "blockLogoRow" => { ..., brands[]->{_id, name, logo} }
      }
    },
  }
`;

export const homePageQuery = groq`*[_type == "homePage"][0]{ ${sectionsFragment}, ${seoFragment} }`;
export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{ ${sectionsFragment}, ${seoFragment} }`;
export const workPageQuery = groq`*[_type == "workPage"][0]{ heading, subline, ${sectionsFragment}, ${seoFragment} }`;
export const contactPageQuery = groq`*[_type == "contactPage"][0]{ ${sectionsFragment}, ${seoFragment} }`;

export const introVideoQuery = groq`*[_type == "introVideo"][0]`;
export const siteStyleQuery = groq`*[_type == "siteStyle"][0]`;
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;
export const contactSettingsQuery = groq`*[_type == "contactSettings"][0]`;
export const socialsQuery = groq`*[_type == "social"] | order(order asc)`;

export const allProjectsForGridQuery = groq`
  *[_type == "project"] | order(orderRank asc){
    _id, number, slug, caption, thumbnail, orientation, "brand": brand->{name, logo}
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    ..., "brand": brand->{name, logo, _id}
  }
`;

export const allProjectSlugsForFeedQuery = groq`
  *[_type == "project"] | order(orderRank asc){
    _id, number, slug, caption, video, thumbnail, orientation, reasoningVideo,
    "brand": brand->{name, logo, _id}
  }
`;

export const brandsQuery = groq`*[_type == "brand" && showOnSite == true] | order(name asc)`;
export const faqAboutQuery = groq`*[_type == "faq" && showOnAbout == true] | order(order asc)`;
export const faqAllQuery = groq`*[_type == "faq"] | order(order asc)`;
