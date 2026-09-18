import type { IntroVideo, Section } from "@/lib/types";
import { IntroPlayer } from "@/components/intro/IntroPlayer";

export function IntroVideoSection({ data, intro }: { data: Section; intro: IntroVideo | null }) {
  return (
    <div id="intro-section" className="grid gap-10 sm:grid-cols-2 sm:items-center">
      <div className="order-2 sm:order-1">
        <p className="issue-number text-sm">{data.label as string}</p>
        <p className="mt-4 font-headline text-2xl italic leading-snug sm:text-3xl">
          {data.sideText as string}
        </p>
      </div>
      <div className="order-1 sm:order-2">
        <IntroPlayer intro={intro} variant="inline" />
      </div>
    </div>
  );
}
