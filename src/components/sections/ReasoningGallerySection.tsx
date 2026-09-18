import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { Project, Section } from "@/lib/types";

export function ReasoningGallerySection({ data }: { data: Section & { projects?: Project[] } }) {
  const projects = data.projects || [];
  return (
    <div>
      <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      {data.subline && <p className="mt-2 text-sm opacity-70">{data.subline as string}</p>}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {projects.map((p) => {
          const thumb = urlForImage(p.thumbnail)?.width(600).url();
          return (
            <Link key={p._id} href={`/work/${p.slug.current}?reasoning=1`} className="block">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <p className="magazine-credit mt-2">{p.brand?.name}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
