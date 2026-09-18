"use client";

import { PortableText, type PortableTextComponents } from "@portabletext/react";
import {
  Camera, FilmStrip, Microphone, PenNib, Sparkle, Heart,
  PlayCircle, ShareNetwork, MapPin, CheckCircle, Star, Clock,
} from "@phosphor-icons/react";
import { urlForImage } from "@/sanity/lib/image";
import { RecoloredLogo } from "@/components/ui/RecoloredLogo";
import { MutedLoopVideo } from "@/components/ui/MutedLoopVideo";
import { useIntroOverlay } from "@/components/intro/IntroOverlayProvider";
import type { Section } from "@/lib/types";

const ICONS: Record<string, any> = {
  camera: Camera, "film-strip": FilmStrip, microphone: Microphone, "pen-nib": PenNib,
  sparkle: Sparkle, heart: Heart, "play-circle": PlayCircle, "share-network": ShareNetwork,
  "map-pin": MapPin, "check-circle": CheckCircle, star: Star, clock: Clock,
};

function IntroLinkMark({ children }: { children: React.ReactNode }) {
  const { openIntro } = useIntroOverlay();
  return (
    <button
      type="button"
      onClick={openIntro}
      className="font-headline italic text-accent underline underline-offset-4"
    >
      {children}
    </button>
  );
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 font-headline text-3xl italic">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 font-headline text-2xl italic">{children}</h3>,
    normal: ({ children }) => <p className="mt-5 leading-relaxed">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a href={value?.href} className="underline decoration-detail underline-offset-4">
        {children}
      </a>
    ),
    introLink: ({ children }) => <IntroLinkMark>{children}</IntroLinkMark>,
  },
  types: {
    blockFigureImage: ({ value }) => {
      const src = urlForImage(value)?.width(1400).url();
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={value.alt || ""} className="w-full rounded" />
          {value.caption && <figcaption className="magazine-credit mt-2">{value.caption}</figcaption>}
        </figure>
      );
    },
    blockPullQuote: ({ value }) => (
      <blockquote className="my-10 rounded bg-soft/40 p-6 text-center">
        <p className="font-headline text-2xl italic leading-snug">&ldquo;{value.quote}&rdquo;</p>
        {value.attribution && <p className="mt-3 text-sm opacity-70">{value.attribution}</p>}
      </blockquote>
    ),
    blockBtsClip: ({ value }) => (
      <div className="my-8">
        <MutedLoopVideo video={value.video} poster={value.poster} className="w-full rounded" />
        {value.caption && <p className="magazine-credit mt-2">{value.caption}</p>}
      </div>
    ),
    blockIconInline: ({ value }) => {
      const Icon = ICONS[value.icon] || Sparkle;
      return (
        <span className="my-2 inline-flex items-center gap-2 text-sm">
          <Icon size={18} /> {value.label}
        </span>
      );
    },
    blockLogoRow: ({ value }) => (
      <div className="my-8 flex flex-wrap items-center gap-8">
        {(value.brands || []).map((b: any) => (
          <RecoloredLogo key={b._id} logo={b.logo} name={b.name} className="h-6 w-24" />
        ))}
      </div>
    ),
  },
};

export function RichTextSection({ data }: { data: Section }) {
  return (
    <div>
      {data.heading ? <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2> : null}
      <div className="prose-editorial">
        <PortableText value={data.body as any} components={components} />
      </div>
      {data.signatureText ? (
        <p className="mt-10 font-signature text-5xl text-accent">{data.signatureText as string}</p>
      ) : null}
    </div>
  );
}
