import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { rawHomePageQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { SectionsEditor } from "@/components/manage/sections/SectionsEditor";
import type { PageDoc } from "@/lib/types";

export default async function ManageHomepagePage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const page = await writeClient.fetch<PageDoc | null>(rawHomePageQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Homepage</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Add, remove, reorder and edit the sections that make up the homepage. Changes go live when you hit Save page.
      </p>
      <div className="mt-8">
        <SectionsEditor pageType="homePage" initialSections={page?.sections || []} initialSeo={page?.seo} />
      </div>
    </ManageShell>
  );
}
