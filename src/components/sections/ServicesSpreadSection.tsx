import type { Section } from "@/lib/types";

function Page({ data }: { data: any }) {
  return (
    <div className="border-detail/30 py-8 sm:border-t-0 sm:py-0 sm:pr-10 first:border-t-0">
      <h3 className="font-headline text-2xl italic sm:text-3xl">{data?.heading}</h3>
      <p className="mt-4 text-[0.95rem] leading-relaxed opacity-90">{data?.intro}</p>
      {data?.included?.length > 0 && (
        <ul className="mt-6 space-y-2">
          {data.included.map((item: string, i: number) => (
            <li key={i} className="flex items-baseline gap-3 text-sm">
              <span className="text-detail">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ServicesSpreadSection({ data }: { data: Section }) {
  return (
    <div>
      <p className="issue-number text-sm">{data.sectionLabel as string}</p>
      <div className="mt-6 grid gap-10 sm:grid-cols-2 sm:divide-x sm:divide-detail/30">
        <Page data={data.leftPage} />
        <Page data={data.rightPage} />
      </div>
    </div>
  );
}
