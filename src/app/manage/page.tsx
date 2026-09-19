import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { ManageShell } from "@/components/manage/ManageShell";
import { MANAGE_NAV } from "@/lib/manageNav";

export default async function ManageHomePage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <p className="max-w-sm opacity-70">
          Your passcode only has posting access. Sign in with the owner passcode to manage the rest of the site.
        </p>
      </div>
    );
  }

  const live = MANAGE_NAV.filter((i) => i.status === "live");
  const soon = MANAGE_NAV.filter((i) => i.status === "soon");

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Manage MOVEL</h1>
      <p className="mt-2 max-w-lg opacity-70">
        This is replacing the Sanity Studio admin, one section at a time. What&rsquo;s built so far is on the left
        and ready to use — everything else still lives in Sanity&rsquo;s own editor at <code>/admin</code> until it
        gets its own page here.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {live.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-lg border border-detail/30 p-4 hover:border-accent"
          >
            <p className="font-headline italic">{item.label}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-accent">Ready</p>
          </a>
        ))}
        {soon.map((item) => (
          <div key={item.href} className="rounded-lg border border-detail/10 p-4 opacity-50">
            <p className="font-headline italic">{item.label}</p>
            <p className="mt-1 text-xs uppercase tracking-widest">Coming soon — use /admin for now</p>
          </div>
        ))}
      </div>
    </ManageShell>
  );
}
