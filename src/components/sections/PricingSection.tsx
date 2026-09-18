import type { Section } from "@/lib/types";

export function PricingSection({ data }: { data: Section }) {
  const rows = (data.rows as any[]) || [];
  return (
    <div>
      <h2 className="font-headline text-3xl italic sm:text-4xl">{data.heading as string}</h2>
      <div className="mt-8 divide-y divide-detail/30 border-y border-detail/30">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <span>{row.service}</span>
            <span className="issue-number">
              {row.priceNaira ? `₦${row.priceNaira}` : ""} {row.priceDollar ? `/ $${row.priceDollar}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
