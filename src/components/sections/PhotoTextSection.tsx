import { urlForImage } from "@/sanity/lib/image";
import type { Section } from "@/lib/types";

export function PhotoTextSection({ data }: { data: Section }) {
  const src = urlForImage(data.image as any)?.width(1200).url();
  const reverse = data.imageSide === "right";
  return (
    <div className={`grid items-center gap-10 sm:grid-cols-2 ${reverse ? "sm:[&>*:first-child]:order-2" : ""}`}>
      <div>
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={(data.image as any)?.alt || ""} className="w-full rounded" />
        )}
      </div>
      <div>
        {data.heading ? <h3 className="font-headline text-2xl italic sm:text-3xl">{data.heading as string}</h3> : null}
        {data.text ? <p className="mt-4 leading-relaxed opacity-90">{data.text as string}</p> : null}
      </div>
    </div>
  );
}
