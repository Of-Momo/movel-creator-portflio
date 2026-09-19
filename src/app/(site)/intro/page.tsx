import type { Metadata } from "next";
import Link from "next/link";
import { getIntroVideo } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { IntroPlayer } from "@/components/intro/IntroPlayer";
import { X } from "@phosphor-icons/react/dist/ssr";

export async function generateMetadata(): Promise<Metadata> {
  const intro = await getIntroVideo();
  const image = urlForImage(intro?.poster)?.width(1200).height(630).url();
  return {
    title: "Meet Mo",
    description: "One minute on what I make for brands.",
    openGraph: { title: "Meet Mo", description: "One minute on what I make for brands.", images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title: "Meet Mo", images: image ? [image] : undefined },
    alternates: { canonical: "/intro" },
  };
}

export default async function IntroPage() {
  const intro = await getIntroVideo();
  return (
    <div className="fixed inset-0 z-50 h-[100dvh] w-full bg-ink">
      <IntroPlayer intro={intro} variant="standalone" />
      <Link
        href="/"
        aria-label="Close"
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/50 text-paper backdrop-blur"
      >
        <X size={18} />
      </Link>
    </div>
  );
}
