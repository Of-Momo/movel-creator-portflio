import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";
import type { Project, Section } from "@/lib/types";

export function FeaturedWorkSection({ data }: { data: Section & { projects?: Project[] } }) {
  const projects = data.projects || [];
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      </div>
      {data.subline && <p className="mt-2 text-sm opacity-70">{data.subline as string}</p>}

      <div className="mt-10 grid gap-8 sm:grid-cols-3">
        {projects.map((p) => {
          const thumb = urlForImage(p.thumbnail)?.width(800).url();
          return (
            <Link key={p._id} href={`/work/${p.slug.current}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink/10">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={p.thumbnail?.alt || ""}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
                <span className="issue-number absolute left-3 top-3 rounded bg-paper/85 px-2 py-1 text-xs">
                  No. {String(p.number).padStart(2, "0")}
                </span>
              </div>
              <p className="magazine-credit mt-2">
                Directed &amp; performed by Mo · Brand: {p.brand?.name}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <Link href="/work" className="font-headline italic text-accent underline underline-offset-4">
          See all work →
        </Link>
      </div>
    </div>
  );
}
