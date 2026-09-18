"use client";

import { createContext, useContext, useState } from "react";
import type { IntroVideo } from "@/lib/types";
import { IntroPlayer } from "./IntroPlayer";

const IntroOverlayContext = createContext<{ openIntro: () => void } | null>(null);

export function useIntroOverlay() {
  const ctx = useContext(IntroOverlayContext);
  if (!ctx) throw new Error("useIntroOverlay must be used within IntroOverlayProvider");
  return ctx;
}

export function IntroOverlayProvider({
  intro,
  children,
}: {
  intro: IntroVideo | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <IntroOverlayContext.Provider value={{ openIntro: () => setOpen(true) }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[100] h-[100dvh] w-full">
          <IntroPlayer intro={intro} variant="overlay" onClose={() => setOpen(false)} />
        </div>
      )}
    </IntroOverlayContext.Provider>
  );
}
