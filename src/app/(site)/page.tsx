import type { Metadata } from "next";
import { getContactSettings, getHomePage, getIntroVideo } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const seo = page?.seo;
  return {
    title: seo?.title || "Mo | Content Creator & Director in Lagos | MOVEL",
    description:
      seo?.description ||
      "Mo is a Lagos-based content creator and director making short-form brand video, in front of the camera or behind it, for brands in Nigeria and worldwide.",
    openGraph: {
      images: urlForImage(seo?.shareImage)?.width(1200).height(630).url()
        ? [urlForImage(seo?.shareImage)!.width(1200).height(630).url()!]
        : undefined,
    },
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [page, intro, contactSettings] = await Promise.all([
    getHomePage(),
    getIntroVideo(),
    getContactSettings(),
  ]);

  if (!page) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
        <p className="max-w-md font-headline text-2xl italic opacity-70">
          The homepage hasn&rsquo;t been set up in the admin yet. Connect Sanity and run the seed script — see SETUP.md.
        </p>
      </div>
    );
  }

  return <SectionRenderer sections={page.sections} intro={intro} contactSettings={contactSettings} />;
}
