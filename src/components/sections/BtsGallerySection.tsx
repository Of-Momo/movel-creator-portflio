import type { Section } from "@/lib/types";
import { MutedLoopVideo } from "@/components/ui/MutedLoopVideo";

export function BtsGallerySection({ data }: { data: Section }) {
  const clips = (data.clips as any[]) || [];
  if (clips.length === 0) return null;
  return (
    <div>
      <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {clips.map((clip, i) => (
          <div key={i}>
            <MutedLoopVideo video={clip.video} poster={clip.poster} className="aspect-[9/16] w-full rounded object-cover" />
            {clip.caption && <p className="magazine-credit mt-2">{clip.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
