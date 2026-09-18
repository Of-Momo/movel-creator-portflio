"use client";

import { useEffect, useRef, useState } from "react";
import { urlForImage, fileUrl } from "@/sanity/lib/image";
import type { Section } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/hooks";

function hotspotPosition(image: any) {
  const h = image?.hotspot;
  if (!h) return "center";
  return `${Math.round(h.x * 100)}% ${Math.round(h.y * 100)}%`;
}

export function CoverSection({ data }: { data: Section }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      setOffset((o) => ({ ...o, y: Math.min(scrolled * 0.08, 40) }));
    };
    const onMouse = (e: MouseEvent) => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      setOffset((o) => ({ ...o, x: x * 16 }));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [reduced]);

  const imgMobile = urlForImage(data.imageMobile as any)?.width(1200).url();
  const imgDesktop = urlForImage(data.imageDesktop as any)?.width(2400).url();
  const cutoutMobile = urlForImage(data.cutoutMobile as any)?.width(1200).url();
  const cutoutDesktop = urlForImage(data.cutoutDesktop as any)?.width(2400).url();
  const livingMobile = fileUrl((data.livingCoverVideoMobile as any)?.asset?._ref);
  const livingDesktop = fileUrl((data.livingCoverVideoDesktop as any)?.asset?._ref);
  const useLiving = Boolean(data.livingCoverEnabled) && (livingMobile || livingDesktop);

  const coverLines = (data.coverLines as string[] | undefined) || [];
  const introIndex = (data.introLinkLineIndex as number | undefined) || 0;

  const handleIntroClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("movel:play-intro-inline"));
  };

  return (
    <div
      ref={rootRef}
      className="relative flex h-[100dvh] w-full items-end overflow-hidden bg-ink text-paper"
    >
      {/* Background photo layer */}
      <div
        className={`absolute inset-0 ${reduced ? "" : "animate-slow-zoom"}`}
        style={!reduced ? { transform: `translate3d(${offset.x * 0.4}px, ${offset.y * 0.4}px, 0)` } : undefined}
      >
        {useLiving ? (
          <>
            <video
              className="block h-full w-full object-cover sm:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              src={livingMobile || livingDesktop}
            />
            <video
              className="hidden h-full w-full object-cover sm:block"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              src={livingDesktop || livingMobile}
            />
          </>
        ) : (
          <>
            {imgMobile && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgMobile}
                alt={(data.imageMobile as any)?.alt || ""}
                className="block h-full w-full object-cover sm:hidden"
                style={{ objectPosition: hotspotPosition(data.imageMobile) }}
              />
            )}
            {imgDesktop && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgDesktop}
                alt={(data.imageDesktop as any)?.alt || ""}
                className="hidden h-full w-full object-cover sm:block"
                style={{ objectPosition: hotspotPosition(data.imageDesktop) }}
              />
            )}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
      </div>

      {/* Masthead — sits behind the cutout */}
      <div className="pointer-events-none absolute inset-x-0 top-[8%] z-10 text-center sm:top-[10%]">
        <p className="issue-number text-xs sm:text-sm">{data.issueLine as string}</p>
        <h1 className="font-headline text-[18vw] leading-none tracking-tight sm:text-[9vw]">
          {data.masthead as string}
        </h1>
      </div>

      {/* Cutout foreground layer */}
      {(cutoutMobile || cutoutDesktop) && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={!reduced ? { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` } : undefined}
        >
          {cutoutMobile && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cutoutMobile} alt="" className="block h-full w-full object-cover sm:hidden" />
          )}
          {cutoutDesktop && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cutoutDesktop} alt="" className="hidden h-full w-full object-cover sm:block" />
          )}
        </div>
      )}

      {/* Cover lines */}
      <div className="relative z-30 w-full px-4 pb-10 sm:px-8 sm:pb-16">
        <div className="mx-auto max-w-editorial">
          <p className="font-headline text-sm uppercase tracking-[0.2em] text-detail">{data.coverStar as string}</p>
          <ul className="mt-3 space-y-1.5">
            {coverLines.map((line, i) => (
              <li key={i} className="font-headline text-xl italic leading-snug sm:text-2xl">
                {i + 1 === introIndex ? (
                  <a href="#intro-section" onClick={handleIntroClick} className="underline decoration-detail underline-offset-4">
                    {line}
                  </a>
                ) : (
                  line
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
