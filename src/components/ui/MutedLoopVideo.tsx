"use client";

import { useEffect, useRef } from "react";
import { fileUrl } from "@/sanity/lib/image";
import { urlForImage } from "@/sanity/lib/image";
import type { SanityFileAsset, SanityImage } from "@/lib/types";

export function MutedLoopVideo({
  video,
  poster,
  className = "",
}: {
  video?: SanityFileAsset;
  poster?: SanityImage;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const src = fileUrl(video?.asset?._ref);
  const posterUrl = urlForImage(poster)?.width(900).url();
  if (!src) return null;

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
      poster={posterUrl}
      src={src}
      aria-hidden
    />
  );
}
