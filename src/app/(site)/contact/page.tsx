import type { Metadata } from "next";
import { getContactPage, getContactSettings } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SectionShell } from "@/components/ui/SectionShell";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  const seo = page?.seo;
  return {
    title: seo?.title || "Contact",
    description: seo?.description || "Tell Mo what you need — she'll get back to you within 48 hours.",
    openGraph: {
      images: urlForImage(seo?.shareImage)?.width(1200).height(630).url()
        ? [urlForImage(seo?.shareImage)!.width(1200).height(630).url()!]
        : undefined,
    },
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const [page, contactSettings] = await Promise.all([getContactPage(), getContactSettings()]);

  if (!page) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 pt-24 text-center">
        <p className="max-w-md font-headline text-2xl italic opacity-70">
          The Contact page hasn&rsquo;t been set up in the admin yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <SectionRenderer sections={page.sections} contactSettings={contactSettings} />
      {contactSettings && (
        <SectionShell background="soft">
          <p className="text-center text-sm opacity-80">Prefer to skip the form?</p>
          <div className="mt-3 flex flex-col items-center gap-1 text-center">
            {contactSettings.whatsappNumber && (
              <a href={`https://wa.me/${contactSettings.whatsappNumber.replace(/[^\d]/g, "")}`} className="underline">
                WhatsApp: {contactSettings.whatsappNumber}
              </a>
            )}
            {contactSettings.email && (
              <a href={`mailto:${contactSettings.email}`} className="underline">
                Email: {contactSettings.email}
              </a>
            )}
          </div>
        </SectionShell>
      )}
    </div>
  );
}
