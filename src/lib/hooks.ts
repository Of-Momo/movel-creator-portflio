"use client";

import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.5,
      ...options,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);
  return { ref, inView };
}

export function useSoundPreference() {
  const [soundOn, setSoundOn] = useState(false);
  useEffect(() => {
    setSoundOn(sessionStorage.getItem("movel:sound") === "on");
  }, []);
  const enableSound = () => {
    sessionStorage.setItem("movel:sound", "on");
    setSoundOn(true);
  };
  return { soundOn, enableSound };
}
