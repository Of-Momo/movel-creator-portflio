"use client";

import { useEffect, useRef, useState } from "react";
import { fileUrl, urlForImage } from "@/sanity/lib/image";
import type { IntroVideo } from "@/lib/types";
import { useInView, useSoundPreference } from "@/lib/hooks";
import { SpeakerHigh, SpeakerSlash, Play, X, ShareNetwork } from "@phosphor-icons/react/dist/ssr";

const WATCHED_KEY = "movel:introWatched";

export function IntroPlayer({
  intro,
  variant,
  onClose,
}: {
  intro: IntroVideo | null;
  variant: "inline" | "overlay" | "standalone";
  onClose?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const { soundOn, enableSound } = useSoundPreference();
  const [hasPlayed, setHasPlayed] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(variant !== "inline");
  const [muted, setMuted] = useState(variant === "inline");
  const autoTriggeredRef = useRef(false);

  const src = fileUrl(intro?.video?.asset?._ref);
  const posterUrl = urlForImage(intro?.poster)?.width(1200).url();
  const captionsUrl = fileUrl(intro?.captionsFile?.asset?._ref);

  const play = (withSound: boolean) => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !withSound;
    setMuted(!withSound);
    el.currentTime = variant === "inline" && hasPlayed ? el.currentTime : el.currentTime;
    el.play().catch(() => {});
    setShowPlayButton(false);
  };

  // Inline: autoplay once, muted, first time it scrolls into view.
  useEffect(() => {
    if (variant !== "inline" || autoTriggeredRef.current) return;
    const watched = typeof window !== "undefined" && localStorage.getItem(WATCHED_KEY) === "true";
    if (watched) {
      setShowPlayButton(true);
      return;
    }
    if (inView) {
      autoTriggeredRef.current = true;
      play(false);
    }
  }, [inView, variant]);

  // Overlay / standalone: play immediately, unmuted (this is always a direct user tap).
  useEffect(() => {
    if (variant === "inline") return;
    play(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  // On-demand trigger from the cover's "Watch the intro" link.
  useEffect(() => {
    if (variant !== "inline") return;
    const handler = () => {
      document.getElementById("intro-section")?.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(() => play(soundOn), 500);
    };
    window.addEventListener("movel:play-intro-inline", handler);
    return () => window.removeEventListener("movel:play-intro-inline", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn]);

  const handleEnded = () => {
    setShowPlayButton(true);
    if (typeof window !== "undefined") localStorage.setItem(WATCHED_KEY, "true");
    setHasPlayed(true);
  };

  const handleUnmute = () => {
    enableSound();
    if (videoRef.current) videoRef.current.muted = false;
    setMuted(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/intro`;
    if (navigator.share) {
      await navigator.share({ url, title: "Meet Mo" }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (!src) {
    return (
      <div className="flex aspect-[9/16] max-h-[80vh] items-center justify-center rounded-lg border border-dashed border-detail/50 text-sm opacity-60">
        Intro video not uploaded yet — add it in the admin under &ldquo;Intro Video&rdquo;.
      </div>
    );
  }

  const isOverlay = variant === "overlay" || variant === "standalone";

  return (
    <div
      ref={viewRef}
      className={
        isOverlay
          ? "relative flex h-full w-full items-center justify-center bg-ink"
          : "relative mx-auto aspect-[9/16] max-h-[80vh] w-full max-w-sm overflow-hidden rounded-lg bg-ink sm:max-w-md"
      }
    >
      <video
        ref={videoRef}
        className="h-full w-full object-contain"
        playsInline
        muted={muted}
        preload="none"
        poster={posterUrl}
        src={src}
        onEnded={handleEnded}
      >
        {captionsUrl && <track kind="captions" src={captionsUrl} default />}
      </video>

      {showPlayButton && (
        <button
          type="button"
          onClick={() => play(soundOn)}
          aria-label="Play intro"
          className="absolute inset-0 flex items-center justify-center bg-ink/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper/90 text-ink">
            <Play size={28} weight="fill" />
          </span>
        </button>
      )}

      {!showPlayButton && muted && (
        <button
          type="button"
          onClick={handleUnmute}
          aria-label="Tap for sound"
          className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur"
        >
          <SpeakerSlash size={18} />
        </button>
      )}
      {!showPlayButton && !muted && (
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur">
          <SpeakerHigh size={18} />
        </span>
      )}

      {isOverlay && (
        <div className="absolute right-4 top-4 flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share intro"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur"
          >
            <ShareNetwork size={18} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/15 text-paper backdrop-blur"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
