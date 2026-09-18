import type { Brand, Section } from "@/lib/types";
import { RecoloredLogo } from "@/components/ui/RecoloredLogo";

export function BrandStripSection({ data }: { data: Section & { brands?: Brand[] } }) {
  const brands = data.brands || [];
  const color = data.background === "ink" ? "var(--paper)" : "var(--ink)";
  return (
    <div>
      <p className="issue-number text-center text-sm">{data.heading as string}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {brands.map((b) => (
          <RecoloredLogo key={b._id} logo={b.logo} name={b.name} color={color} className="h-7 w-28" />
        ))}
      </div>
    </div>
  );
}
