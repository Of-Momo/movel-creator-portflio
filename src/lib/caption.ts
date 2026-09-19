export function splitCaption(raw: string) {
  const marker = /\n?\s*---\s*\n?/;
  const parts = raw.split(marker);
  const short = parts[0]?.trim() || "";
  const rest = parts.slice(1).join("\n").trim();
  const full = rest ? `${short}\n\n${rest}` : short;
  return { short, full, hasMore: Boolean(rest) };
}
