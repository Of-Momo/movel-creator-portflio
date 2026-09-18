export function SectionShell({
  background = "paper",
  children,
  className = "",
  id,
}: {
  background?: "paper" | "ink" | "soft";
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const bgVar = background === "ink" ? "var(--ink)" : background === "soft" ? "var(--soft)" : "var(--paper)";
  const textColor = background === "ink" ? "var(--paper)" : "var(--ink)";
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24 ${className}`}
      style={{ background: bgVar, color: textColor }}
    >
      {background === "ink" && <div className="grain-overlay animate-grain" aria-hidden />}
      <div className="relative mx-auto max-w-editorial">{children}</div>
    </section>
  );
}
