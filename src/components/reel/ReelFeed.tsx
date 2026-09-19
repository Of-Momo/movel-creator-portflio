"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fileUrl } from "@/sanity/lib/image";
import { useSoundPreference } from "@/lib/hooks";
import type { Project } from "@/lib/types";
import { ReelCard } from "./ReelCard";
import { CaretUp, CaretDown, X } from "@phosphor-icons/react";

export function ReelFeed({
  projects,
  initialSlug,
  openReasoningOnMount,
}: {
  projects: Project[];
  initialSlug: string;
  openReasoningOnMount?: boolean;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const initialIndex = Math.max(
    0,
    projects.findIndex((p) => p.slug.current === initialSlug)
  );
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { soundOn, enableSound } = useSoundPreference();
  const [reasoningOpen, setReasoningOpen] = useState(Boolean(openReasoningOnMount));

  useEffect(() => {
    cardRefs.current[initialIndex]?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = cardRefs.current.findIndex((el) => el === entry.target);
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.6] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [projects.length]);

  useEffect(() => {
    const slug = projects[currentIndex]?.slug.current;
    if (slug) router.replace(`/work/${slug}`, { scroll: false });
  }, [currentIndex, projects, router]);

  const goTo = useCallback((idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") goTo(Math.min(currentIndex + 1, projects.length));
      if (e.key === "ArrowUp") goTo(Math.max(currentIndex - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, goTo, projects.length]);

  const currentProject = projects[currentIndex];
  const reasoningSrc = useMemo(
    () => fileUrl(currentProject?.reasoningVideo?.asset?._ref),
    [currentProject]
  );

  return (
    <div className="fixed inset-0 z-50 bg-ink">
      <div
        ref={containerRef}
        className="no-scrollbar h-full w-full snap-y snap-mandatory overflow-y-scroll"
      >
        {projects.map((p, i) => (
          <ReelCard
            key={p._id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            project={p}
            active={i === currentIndex}
            isNext={i === currentIndex + 1}
            muted={!soundOn}
            onUnmute={enableSound}
            onOpenReasoning={() => setReasoningOpen(true)}
          />
        ))}

        {/* end card */}
        <div className="flex h-[100dvh] w-full snap-start flex-col items-center justify-center gap-6 bg-ink px-8 text-center text-paper">
          <p className="font-headline text-2xl italic">You&rsquo;re all caught up.</p>
          <p className="opacity-80">Like what you saw? Let&rsquo;s make yours.</p>
          <Link
            href="/contact"
            className="rounded-full bg-accent px-8 py-3 text-sm uppercase tracking-[0.15em]"
          >
            Work with Mo
          </Link>
        </div>
      </div>

      {/* desktop nav arrows */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-3 sm:flex">
        <button
          type="button"
          onClick={() => goTo(Math.max(currentIndex - 1, 0))}
          aria-label="Previous video"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur"
        >
          <CaretUp size={18} />
        </button>
        <button
          type="button"
          onClick={() => goTo(Math.min(currentIndex + 1, projects.length))}
          aria-label="Next video"
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur"
        >
          <CaretDown size={18} />
        </button>
      </div>

      <Link
        href="/work"
        aria-label="Close"
        className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-ink/50 text-paper backdrop-blur"
      >
        <X size={18} />
      </Link>

      {reasoningOpen && reasoningSrc && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink">
          <video className="h-full w-full object-contain" src={reasoningSrc} autoPlay playsInline controls />
          <button
            type="button"
            onClick={() => setReasoningOpen(false)}
            aria-label="Close reasoning video"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
