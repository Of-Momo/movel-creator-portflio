import type { Faq, Section } from "@/lib/types";
import { Accordion } from "@/components/ui/Accordion";

export function FullFaqSection({ data }: { data: Section & { items?: Faq[] } }) {
  const items = data.items || [];
  return (
    <div id="faq">
      <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      <div className="mt-8">
        <Accordion items={items} />
      </div>
    </div>
  );
}
