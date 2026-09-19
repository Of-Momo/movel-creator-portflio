import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjectsForGrid, getContactSettings, getIntroVideo, getWorkPage } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SectionShell } from "@/components/ui/SectionShell";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWorkPage();
  return {
    title: page?.seo?.title || "The Work",
    description: page?.seo?.description || "Every project Mo has made for brands — tap anything, swipe through everything.",
    alternates: { canonical: "/work" },
  };
}

export default async function WorkPage() {
  const [page, projects, intro, contactSettings] = await Promise.all([
    getWorkPage(),
    getAllProjectsForGrid(),
    getIntroVideo(),
    getContactSettings(),
  ]);

  return (
    <>
      <SectionShell background="paper" className="pt-28 sm:pt-32">
        <h1 className="font-headline text-4xl italic sm:text-6xl">{page?.heading || "The Work"}</h1>
        {page?.subline && <p className="mt-3 opacity-70">{page.subline}</p>}

        {projects.length === 0 ? (
          <p className="mt-12 opacity-60">No projects yet — add some in the admin under Projects.</p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
            {projects.map((p: any) => {
              const thumb = urlForImage(p.thumbnail)?.width(700).url();
              return (
                <Link key={p._id} href={`/work/${p.slug.current}`} className="group block">
                  <div
                    className={`relative overflow-hidden bg-ink/10 ${
                      p.orientation === "horizontal" ? "aspect-video" : "aspect-[4/5]"
                    }`}
                  >
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={p.thumbnail?.alt || ""}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <span className="issue-number absolute left-2 top-2 rounded bg-paper/85 px-1.5 py-0.5 text-[0.65rem] sm:text-xs">
                      No. {String(p.number).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="magazine-credit mt-1.5 truncate">{p.brand?.name}</p>
                </Link>
              );
            })}
          </div>
        )}
      </SectionShell>

      {page?.sections && (
        <SectionRenderer sections={page.sections} intro={intro} contactSettings={contactSettings} />
      )}
    </>
  );
}
