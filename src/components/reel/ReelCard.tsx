"use client";

import Link from "next/link";
import { forwardRef, useEffect, useRef, useState } from "react";
import { fileUrl, urlForImage } from "@/sanity/lib/image";
import { splitCaption } from "@/lib/caption";
import type { Project } from "@/lib/types";
import { RecoloredLogo } from "@/components/ui/RecoloredLogo";
import { SpeakerHigh, SpeakerSlash, ShareNetwork, ChatCircleText } from "@phosphor-icons/react";

export const ReelCard = forwardRef<
  HTMLDivElement,
  {
    project: Project;
    active: boolean;
    isNext: boolean;
    muted: boolean;
    onUnmute: () => void;
    onOpenReasoning: () => void;
  }
>(function ReelCard({ project, active, isNext, muted, onUnmute, onOpenReasoning }, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const { short, full, hasMore } = splitCaption(project.caption || "");

  const src = fileUrl(project.video?.asset?._ref);
  const thumb = urlForImage(project.thumbnail)?.width(1200).url();

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
      setProgress(0);
    }
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, []);

  const handleShare = async () => {
    const url = `${window.location.origin}/work/${project.slug.current}`;
    if (navigator.share) {
      await navigator.share({ url, title: `${project.brand?.name} × Mo` }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const preload = active || isNext ? "auto" : "none";
  const isHorizontal = project.orientation === "horizontal";

  return (
    <div ref={ref} className="relative flex h-[100dvh] w-full snap-start snap-always items-center justify-center bg-ink">
      <div
        className={
          isHorizontal
            ? "relative aspect-video w-full max-w-3xl"
            : "relative h-full max-h-[100dvh] w-full max-w-[480px] sm:h-[92dvh]"
        }
      >
        {src && (
          <video
            ref={videoRef}
            className="h-full w-full object-contain sm:object-cover"
            muted={muted}
            loop={false}
            playsInline
            preload={preload}
            poster={thumb}
            src={preload === "none" ? undefined : src}
          />
        )}

        {/* progress bar */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-paper/20">
          <div className="h-full bg-paper" style={{ width: `${progress * 100}%` }} />
        </div>

        {/* top: brand */}
        <div className="absolute inset-x-0 top-4 flex items-center gap-2 px-4 text-paper">
          {project.brand?.logo && (
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-paper/90">
              <RecoloredLogo logo={project.brand.logo} name={project.brand.name} color="#1C1512" className="h-5 w-5" />
            </span>
          )}
          <span className="font-headline text-sm italic">{project.brand?.name}</span>
        </div>

        {/* sound toggle */}
        <button
          type="button"
          onClick={onUnmute}
          aria-label={muted ? "Tap for sound" : "Sound on"}
          className="absolute right-4 top-16 flex h-10 w-10 items-center justify-center rounded-full bg-ink/50 text-paper backdrop-blur"
        >
          {muted ? <SpeakerSlash size={18} /> : <SpeakerHigh size={18} />}
        </button>

        {/* right rail actions */}
        <div className="absolute bottom-28 right-3 flex flex-col items-center gap-5 text-paper sm:bottom-8">
          <button type="button" onClick={handleShare} aria-label="Share" className="flex flex-col items-center gap-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/50 backdrop-blur">
              <ShareNetwork size={20} />
            </span>
            <span className="text-[0.65rem]">Share</span>
          </button>
          <Link href="/contact" className="flex flex-col items-center gap-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
              <ChatCircleText size={20} />
            </span>
            <span className="text-[0.65rem]">Work with Mo</span>
          </Link>
        </div>

        {/* caption */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-8 text-paper sm:pb-6">
          <p className={`whitespace-pre-line text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
            {expanded ? full : short}
          </p>
          {hasMore && !expanded && (
            <button type="button" onClick={() => setExpanded(true)} className="mt-1 text-sm font-semibold underline">
              more
            </button>
          )}
        </div>

        {/* expanded caption sheet */}
        {expanded && (
          <div className="absolute inset-0 z-10 flex flex-col justify-end bg-ink/80 backdrop-blur-sm">
            <div className="max-h-[70dvh] overflow-y-auto rounded-t-2xl bg-ink p-6 text-paper">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="mb-4 text-sm uppercase tracking-widest opacity-70"
              >
                Close
              </button>
              <p className="whitespace-pre-line leading-relaxed">{full}</p>
              {project.reasoningVideo && (
                <button
                  type="button"
                  onClick={() => {
                    setExpanded(false);
                    onOpenReasoning();
                  }}
                  className="mt-6 font-headline italic text-detail underline underline-offset-4"
                >
                  Watch my reasoning →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
