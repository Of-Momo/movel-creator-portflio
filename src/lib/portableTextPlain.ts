function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

export function isSimpleBody(body: unknown): body is { _type: string; children?: { text?: string }[] }[] {
  return Array.isArray(body) && body.every((b: any) => b?._type === "block");
}

export function bodyToText(body: { children?: { text?: string }[] }[]): string {
  return body.map((b) => (b.children || []).map((c) => c.text || "").join("")).join("\n\n");
}

export function textToBody(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({
      _key: randomKey(),
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [{ _key: randomKey(), _type: "span", text: p, marks: [] }],
    }));
}
