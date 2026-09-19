import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { allBrandsQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { BrandsEditor } from "@/components/manage/BrandsEditor";
import type { Brand } from "@/lib/types";

export default async function ManageBrandsPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const brands = await writeClient.fetch<(Brand & { _id: string; isPlaceholder?: boolean })[]>(allBrandsQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Brands</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Shown in the homepage brand strip, About page, and as the avatar in the reel feed. Upload a transparent
        PNG or SVG logo — it gets recoloured automatically to match the site.
      </p>
      <div className="mt-8">
        <BrandsEditor initial={brands} />
      </div>
    </ManageShell>
  );
}
