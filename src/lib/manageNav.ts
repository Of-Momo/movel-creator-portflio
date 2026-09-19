export interface ManageNavItem {
  href: string;
  label: string;
  status: "live" | "soon";
}

export const MANAGE_NAV: ManageNavItem[] = [
  { href: "/manage/style", label: "Site Style", status: "live" },
  { href: "/manage/homepage", label: "Homepage", status: "live" },
  { href: "/manage/about", label: "About Page", status: "live" },
  { href: "/manage/work-page", label: "Work Page", status: "live" },
  { href: "/manage/contact-page", label: "Contact Page", status: "live" },
  { href: "/manage/projects", label: "Projects", status: "live" },
  { href: "/manage/brands", label: "Brands", status: "live" },
  { href: "/manage/faq", label: "FAQ", status: "live" },
  { href: "/manage/socials", label: "Socials", status: "live" },
  { href: "/manage/contact-settings", label: "Contact Form Settings", status: "live" },
  { href: "/manage/site-settings", label: "Site Settings", status: "live" },
];
