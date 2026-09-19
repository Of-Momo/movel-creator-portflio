"use client";

interface Row {
  _key: string;
  service?: string;
  priceNaira?: string;
  priceDollar?: string;
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function PricingRowsField({ rows, onChange }: { rows: Row[]; onChange: (next: Row[]) => void }) {
  const update = (i: number, patch: Partial<Row>) => {
    const next = [...rows];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { _key: randomKey() }]);

  const inputClass = "rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm opacity-70">Services</span>
      {rows.map((row, i) => (
        <div key={row._key} className="flex flex-wrap items-center gap-2">
          <input value={row.service || ""} onChange={(e) => update(i, { service: e.target.value })} placeholder="Service" className={`${inputClass} flex-1 min-w-[160px]`} />
          <input value={row.priceNaira || ""} onChange={(e) => update(i, { priceNaira: e.target.value })} placeholder="₦ price" className={`${inputClass} w-28`} />
          <input value={row.priceDollar || ""} onChange={(e) => update(i, { priceDollar: e.target.value })} placeholder="$ price" className={`${inputClass} w-28`} />
          <button type="button" onClick={() => remove(i)} className="text-xs uppercase tracking-widest opacity-60 underline">
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="w-fit rounded-full border border-detail/40 px-4 py-1.5 text-xs uppercase tracking-widest">
        + Add row
      </button>
    </div>
  );
}
