"use client";

import { useEffect, useRef, useState } from "react";

export function FrameScrubber({
  file,
  onFrameChosen,
}: {
  file: File;
  onFrameChosen: (time: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const url = useRef<string>(URL.createObjectURL(file));

  useEffect(() => {
    const u = url.current;
    return () => URL.revokeObjectURL(u);
  }, []);

  const onScrub = (t: number) => {
    setTime(t);
    if (videoRef.current) videoRef.current.currentTime = t;
    onFrameChosen(t);
  };

  return (
    <div>
      <video
        ref={videoRef}
        src={url.current}
        muted
        playsInline
        className="w-full rounded bg-black"
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          setDuration(d);
          onScrub(Math.min(1, d / 2));
        }}
      />
      <input
        type="range"
        min={0}
        max={duration || 1}
        step={0.05}
        value={time}
        onChange={(e) => onScrub(Number(e.target.value))}
        className="mt-2 w-full"
        aria-label="Scrub to pick a thumbnail frame"
      />
      <p className="mt-1 text-xs opacity-60">Drag to pick the frame you want as the thumbnail.</p>
    </div>
  );
}
