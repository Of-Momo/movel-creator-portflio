"use client";

export function StringListField({
  label,
  values,
  onChange,
  multiline,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  multiline?: boolean;
}) {
  const update = (i: number, value: string) => {
    const next = [...values];
    next[i] = value;
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, ""]);

  const Field = multiline ? "textarea" : "input";

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="opacity-70">{label}</span>
      {values.map((v, i) => (
        <div key={i} className="flex gap-2">
          <Field
            value={v}
            onChange={(e: any) => update(i, e.target.value)}
            rows={multiline ? 2 : undefined}
            className="w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 text-xs uppercase tracking-widest opacity-60 underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-fit rounded-full border border-detail/40 px-4 py-1.5 text-xs uppercase tracking-widest"
      >
        + Add
      </button>
    </div>
  );
}
