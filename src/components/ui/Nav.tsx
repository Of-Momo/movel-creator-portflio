"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [pastCover, setPastCover] = useState(!isHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setPastCover(true);
      return;
    }
    setPastCover(false);
    const onScroll = () => {
      setPastCover(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-opacity duration-700 ${
        pastCover ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-editorial items-center justify-between px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="font-headline text-lg tracking-wide text-ink"
          style={{ color: "var(--ink)" }}
        >
          MOVEL
        </Link>
        <nav className="hidden gap-8 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-body text-sm uppercase tracking-[0.15em] text-ink hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          aria-label="Menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 sm:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="block h-[1.5px] w-6 bg-ink" />
          <span className="block h-[1.5px] w-6 bg-ink" />
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 bg-paper px-4 pb-4 sm:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-t border-detail/30 py-3 font-body text-sm uppercase tracking-[0.15em] text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
