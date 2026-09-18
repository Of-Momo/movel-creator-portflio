import type { Section } from "@/lib/types";

export function PullQuoteSection({ data }: { data: Section }) {
  return (
    <div className="text-center">
      <p className="font-headline text-3xl italic leading-snug sm:text-4xl">&ldquo;{data.quote as string}&rdquo;</p>
      {(data.name || data.role) && (
        <p className="mt-6 text-sm uppercase tracking-[0.1em] opacity-70">
          {[data.name, data.role].filter(Boolean).join(", ")}
        </p>
      )}
    </div>
  );
}
