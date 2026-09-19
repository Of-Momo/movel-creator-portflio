import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { faqAllQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { FaqEditor } from "@/components/manage/FaqEditor";
import type { Faq } from "@/lib/types";

export default async function ManageFaqPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const faqs = await writeClient.fetch<(Faq & { _id: string })[]>(faqAllQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">FAQ</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Questions and answers used on the About page and, if you switch it on, the homepage.
      </p>
      <div className="mt-8">
        <FaqEditor initial={faqs} />
      </div>
    </ManageShell>
  );
}
