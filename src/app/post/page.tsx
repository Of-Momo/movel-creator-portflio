import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { client } from "@/sanity/lib/client";
import { brandsQuery } from "@/sanity/lib/queries";
import { PostScreen } from "@/components/post/PostScreen";
import { SignOutButton } from "@/components/post/SignOutButton";

export default async function PostPage() {
  const role = await getSessionRole();
  if (!role) redirect("/post/sign-in");

  const brands = await client.fetch(brandsQuery).catch(() => []);

  return (
    <div className="mx-auto min-h-dvh max-w-md px-4 pb-24 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-headline text-xl italic">MOVEL</p>
          <p className="text-xs opacity-60">{role === "assistant" ? "Assistant (drafts only)" : "Owner"}</p>
        </div>
        <SignOutButton />
      </div>
      <PostScreen brands={brands} role={role} />
    </div>
  );
}
