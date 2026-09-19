import type { Metadata } from "next";
import { getAboutPage, getContactSettings, getIntroVideo } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections/SectionRenderer";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  const seo = page?.seo;
  return {
    title: seo?.title || "About Mo",
    description: seo?.description || "Content creator and director based in Lagos, Nigeria.",
    openGraph: {
      images: urlForImage(seo?.shareImage)?.width(1200).height(630).url()
        ? [urlForImage(seo?.shareImage)!.width(1200).height(630).url()!]
        : undefined,
    },
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const [page, intro, contactSettings] = await Promise.all([
    getAboutPage(),
    getIntroVideo(),
    getContactSettings(),
  ]);

  if (!page) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 pt-24 text-center">
        <p className="max-w-md font-headline text-2xl italic opacity-70">
          The About page hasn&rsquo;t been set up in the admin yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <SectionRenderer sections={page.sections} intro={intro} contactSettings={contactSettings} />
    </div>
  );
}
