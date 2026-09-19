import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { SiteSettingsEditor } from "@/components/manage/SiteSettingsEditor";
import type { SiteSettings } from "@/lib/types";

export default async function ManageSiteSettingsPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const settings = await writeClient.fetch<SiteSettings | null>(siteSettingsQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Site Settings</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Business info and the default text/image used when a page doesn&rsquo;t set its own SEO title, description,
        or share image.
      </p>
      <div className="mt-8">
        <SiteSettingsEditor initial={settings || {}} />
      </div>
    </ManageShell>
  );
}
