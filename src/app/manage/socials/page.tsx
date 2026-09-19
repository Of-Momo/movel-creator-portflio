import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { socialsQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { SocialsEditor } from "@/components/manage/SocialsEditor";
import type { Social } from "@/lib/types";

export default async function ManageSocialsPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const socials = await writeClient.fetch<(Social & { _id: string })[]>(socialsQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Socials</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Links shown in the site footer and nav. Use the arrows to reorder.
      </p>
      <div className="mt-8">
        <SocialsEditor initial={socials} />
      </div>
    </ManageShell>
  );
}
