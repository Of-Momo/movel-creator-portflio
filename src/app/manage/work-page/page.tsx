import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { rawWorkPageQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { SectionsEditor } from "@/components/manage/sections/SectionsEditor";
import type { PageDoc } from "@/lib/types";

export default async function ManageWorkPagePage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const page = await writeClient.fetch<PageDoc | null>(rawWorkPageQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Work Page</h1>
      <p className="mt-2 max-w-lg opacity-70">
        The grid pulls every project automatically, in their set order. Sections added below appear underneath the
        grid.
      </p>
      <div className="mt-8">
        <SectionsEditor
          pageType="workPage"
          initialSections={page?.sections || []}
          initialSeo={page?.seo}
          extra={{ heading: page?.heading, subline: page?.subline }}
        />
      </div>
    </ManageShell>
  );
}
