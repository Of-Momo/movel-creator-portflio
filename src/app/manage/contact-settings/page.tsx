import { redirect } from "next/navigation";
import { getSessionRole } from "@/lib/postSession";
import { writeClient } from "@/sanity/lib/client";
import { contactSettingsQuery } from "@/sanity/lib/queries";
import { ManageShell } from "@/components/manage/ManageShell";
import { ContactSettingsEditor } from "@/components/manage/ContactSettingsEditor";
import type { ContactSettings } from "@/lib/types";

export default async function ManageContactSettingsPage() {
  const role = await getSessionRole();
  if (!role) redirect("/manage/sign-in");
  if (role !== "owner") redirect("/manage");

  const settings = await writeClient.fetch<ContactSettings | null>(contactSettingsQuery);

  return (
    <ManageShell>
      <h1 className="font-headline text-2xl italic">Contact Form Settings</h1>
      <p className="mt-2 max-w-lg opacity-70">
        Everything the contact form on the site uses — your WhatsApp number, field labels, dropdown options, and the
        emails/messages sent when someone submits it.
      </p>
      <div className="mt-8">
        <ContactSettingsEditor initial={settings || {}} />
      </div>
    </ManageShell>
  );
}
