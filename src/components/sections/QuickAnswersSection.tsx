import Link from "next/link";
import type { Faq, Section } from "@/lib/types";
import { Accordion } from "@/components/ui/Accordion";

export function QuickAnswersSection({ data }: { data: Section & { items?: Faq[] } }) {
  const items = data.items || [];
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      <div className="mt-8">
        <Accordion items={items} />
      </div>
      <div className="mt-8">
        <Link href="/about#faq" className="font-headline italic text-accent underline underline-offset-4">
          {data.linkLabel as string}
        </Link>
      </div>
    </div>
  );
}
