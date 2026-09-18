import Link from "next/link";
import type { Section } from "@/lib/types";

export function ClosingLineSection({ data }: { data: Section }) {
  return (
    <div className="text-center">
      <p className="font-headline text-3xl italic leading-snug sm:text-5xl">{data.line as string}</p>
      <Link
        href={(data.buttonLink as string) || "/contact"}
        className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-body text-sm uppercase tracking-[0.15em] text-paper"
      >
        {data.buttonLabel as string}
      </Link>
    </div>
  );
}
