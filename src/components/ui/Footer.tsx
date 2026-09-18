import Link from "next/link";
import type { Social } from "@/lib/types";

const PLATFORM_ICON: Record<string, string> = {
  Instagram: "IG",
  TikTok: "TT",
  LinkedIn: "in",
  YouTube: "YT",
  X: "X",
};

export function Footer({ socials }: { socials: Social[] }) {
  return (
    <footer className="border-t border-detail/30 bg-paper px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-editorial flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-headline text-xl text-ink">MOVEL</p>
          <p className="mt-2 text-sm opacity-70">
            © {new Date().getFullYear()} MOVEL. Lagos, Nigeria.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm uppercase tracking-[0.1em]">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
        {socials?.length > 0 && (
          <div className="flex gap-4">
            {socials.map((s) => (
              <a
                key={s._id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-detail/40 text-xs font-medium"
              >
                {PLATFORM_ICON[s.platform] || s.platform.slice(0, 2)}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}
