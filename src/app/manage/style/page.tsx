import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { siteStyleQuery } from "@/sanity/lib/queries";
import { DEFAULT_THEME } from "@/lib/themeConstants";
import { allFontOptionsHref } from "@/lib/theme";
import { ManageShell } from "@/components/manage/ManageShell";
import { StyleEditor } from "@/components/manage/StyleEditor";
import type { SiteStyle } from "@/lib/types";

export default async function ManageStylePage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const style = await writeClient.fetch<SiteStyle | null>(siteStyleQuery);

  return (
    <ManageShell>
      <link rel="stylesheet" href={allFontOptionsHref()} />
      <h1 className="font-headline text-2xl italic">Site Style</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Pick colours and fonts, save your favourite combinations as presets, and switch between them any time.
        Changes go live on the site as soon as you hit Save.
      </p>
      <div className="mt-8">
        <StyleEditor
          initialColors={style?.colors || (DEFAULT_THEME.colors as any)}
          initialFonts={style?.fonts || DEFAULT_THEME.fonts}
          initialPresets={(style?.presets as any) || []}
        />
      </div>
    </ManageShell>
  );
}
