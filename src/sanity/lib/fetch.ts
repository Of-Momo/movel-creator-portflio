import { draftMode } from "next/headers";
import { client, getDraftModeClient } from "./client";
import { isConfigured } from "./env";
import * as q from "./queries";
import type {
  Brand, ContactSettings, Faq, IntroVideo, PageDoc, Project, SiteSettings, SiteStyle, Social,
} from "@/lib/types";

async function safeFetch<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  if (!isConfigured) return fallback;
  try {
    const { isEnabled } = await draftMode();
    if (isEnabled) {
      return await getDraftModeClient(true).fetch<T>(query, params);
    }
    return await client.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch (err) {
    console.error("Sanity fetch failed:", err);
    return fallback;
  }
}

export const getHomePage = () => safeFetch<PageDoc | null>(q.homePageQuery, {}, null);
export const getAboutPage = () => safeFetch<PageDoc | null>(q.aboutPageQuery, {}, null);
export const getWorkPage = () => safeFetch<PageDoc | null>(q.workPageQuery, {}, null);
export const getContactPage = () => safeFetch<PageDoc | null>(q.contactPageQuery, {}, null);
export const getIntroVideo = () => safeFetch<IntroVideo | null>(q.introVideoQuery, {}, null);
export const getSiteStyle = () => safeFetch<SiteStyle | null>(q.siteStyleQuery, {}, null);
export const getSiteSettings = () => safeFetch<SiteSettings | null>(q.siteSettingsQuery, {}, null);
export const getContactSettings = () => safeFetch<ContactSettings | null>(q.contactSettingsQuery, {}, null);
export const getSocials = () => safeFetch<Social[]>(q.socialsQuery, {}, []);
export const getAllProjectsForGrid = () => safeFetch<Project[]>(q.allProjectsForGridQuery, {}, []);
export const getAllProjectsForFeed = () => safeFetch<Project[]>(q.allProjectSlugsForFeedQuery, {}, []);
export const getProjectBySlug = (slug: string) =>
  safeFetch<(Project & { _createdAt?: string }) | null>(q.projectBySlugQuery, { slug }, null);
export const getBrands = () => safeFetch<Brand[]>(q.brandsQuery, {}, []);
export const getFaqAbout = () => safeFetch<Faq[]>(q.faqAboutQuery, {}, []);
export const getFaqAll = () => safeFetch<Faq[]>(q.faqAllQuery, {}, []);
