import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { rawContactPageQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { SectionsEditor } from "@/components/manage/sections/SectionsEditor";
import type { PageDoc } from "@/lib/types";

export default async function ManageContactPagePage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const page = await writeClient.fetch<PageDoc | null>(rawContactPageQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Contact Page</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Add, remove, reorder and edit the sections that make up the Contact page.
      </p>
      <div className="mt-8">
        <SectionsEditor pageType="contactPage" initialSections={page?.sections || []} initialSeo={page?.seo} />
      </div>
    </ManageShell>
  );
}
