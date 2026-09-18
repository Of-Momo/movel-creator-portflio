import { client } from "./client";
import { isConfigured } from "./env";
import * as q from "./queries";

async function safeFetch<T>(query: string, params: Record<string, unknown> = {}, fallback: T): Promise<T> {
  if (!isConfigured) return fallback;
  try {
    return await client.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return fallback;
  }
}

export const getHomePage = () => safeFetch(q.homePageQuery, {}, null);
export const getAboutPage = () => safeFetch(q.aboutPageQuery, {}, null);
export const getWorkPage = () => safeFetch(q.workPageQuery, {}, null);
export const getContactPage = () => safeFetch(q.contactPageQuery, {}, null);
export const getIntroVideo = () => safeFetch(q.introVideoQuery, {}, null);
export const getSiteStyle = () => safeFetch(q.siteStyleQuery, {}, null);
export const getSiteSettings = () => safeFetch(q.siteSettingsQuery, {}, null);
export const getContactSettings = () => safeFetch(q.contactSettingsQuery, {}, null);
export const getSocials = () => safeFetch(q.socialsQuery, {}, []);
export const getAllProjectsForGrid = () => safeFetch(q.allProjectsForGridQuery, {}, []);
export const getAllProjectsForFeed = () => safeFetch(q.allProjectSlugsForFeedQuery, {}, []);
export const getProjectBySlug = (slug: string) => safeFetch(q.projectBySlugQuery, { slug }, null);
export const getBrands = () => safeFetch(q.brandsQuery, {}, []);
export const getFaqAbout = () => safeFetch(q.faqAboutQuery, {}, []);
export const getFaqAll = () => safeFetch(q.faqAllQuery, {}, []);
