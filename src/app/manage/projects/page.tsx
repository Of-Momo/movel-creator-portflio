import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { allProjectsForManageQuery, allBrandsQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { ProjectsEditor } from "@/components/manage/ProjectsEditor";

export default async function ManageProjectsPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const [projects, brands] = await Promise.all([
    writeClient.fetch(allProjectsForManageQuery),
    writeClient.fetch<{ _id: string; name: string }[]>(allBrandsQuery),
  ]);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Projects</h1>
      <p className="mt-2 max-w-lg opacity-70">
        The work feed. You can also post new work quickly from your phone at <code>/post</code> — this page is for
        full edits and reordering.
      </p>
      <div className="mt-8">
        <ProjectsEditor initial={projects} brands={brands} />
      </div>
    </ManageShell>
  );
}
