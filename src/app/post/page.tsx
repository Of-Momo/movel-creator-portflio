import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { client } from "@/sanity/lib/client";
import { brandsQuery } from "@/sanity/lib/queries";
import { PostScreen } from "@/components/post/PostScreen";

export default async function PostPage() {
  const session = await auth();
  if (!session?.user) redirect("/post/sign-in");

  const brands = await client.fetch(brandsQuery).catch(() => []);
  const role = (session.user as any).role as "owner" | "assistant";

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-24 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-headline text-xl italic">MOVEL</p>
          <p className="text-xs opacity-60">
            Signed in as {session.user.email} {role === "assistant" && "(assistant — drafts only)"}
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/post/sign-in" });
          }}
        >
          <button type="submit" className="text-xs uppercase tracking-widest opacity-60 underline">
            Sign out
          </button>
        </form>
      </div>
      <PostScreen brands={brands} role={role} />
    </div>
  );
}
