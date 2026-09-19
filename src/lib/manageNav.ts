export interface ManageNavItem {
  href: string;
  label: string;
  status: "live" | "soon";
}

export const MANAGE_NAV: ManageNavItem[] = [
  { href: "/manage/style", label: "Site Style", status: "live" },
  { href: "/manage/homepage", label: "Homepage", status: "soon" },
  { href: "/manage/about", label: "About Page", status: "soon" },
  { href: "/manage/work-page", label: "Work Page", status: "soon" },
  { href: "/manage/contact-page", label: "Contact Page", status: "soon" },
  { href: "/manage/projects", label: "Projects", status: "soon" },
  { href: "/manage/brands", label: "Brands", status: "soon" },
  { href: "/manage/faq", label: "FAQ", status: "soon" },
  { href: "/manage/socials", label: "Socials", status: "soon" },
  { href: "/manage/contact-settings", label: "Contact Form Settings", status: "soon" },
  { href: "/manage/site-settings", label: "Site Settings", status: "soon" },
];
