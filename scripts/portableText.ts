// Turns plain paragraphs (with a {{INTRO_LINK:text}} token) into Portable
// Text blocks for the richTextBody schema, so the seed script doesn't have
// to hand-write block JSON for every paragraph.

function key(prefix: string, i: number) {
  return `${prefix}${i}`;
}

export function paragraphsToBlocks(text: string, keyPrefix = "block") {
  const paragraphs = text.split(/\n\n+/);
  return paragraphs.map((para, i) => {
    const introMatch = para.match(/^([\s\S]*)\{\{INTRO_LINK:(.+?)\}\}([\s\S]*)$/);
    if (introMatch) {
      const [, before, linkText, after] = introMatch;
      const children = [];
      let markDefKey = "introlink1";
      if (before) children.push({ _type: "span", _key: key(keyPrefix, i) + "a", text: before, marks: [] });
      children.push({
        _type: "span",
        _key: key(keyPrefix, i) + "b",
        text: linkText,
        marks: [markDefKey],
      });
      if (after) children.push({ _type: "span", _key: key(keyPrefix, i) + "c", text: after, marks: [] });
      return {
        _type: "block",
        _key: key(keyPrefix, i),
        style: "normal",
        markDefs: [{ _type: "introLink", _key: markDefKey }],
        children,
      };
    }
    return {
      _type: "block",
      _key: key(keyPrefix, i),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: key(keyPrefix, i) + "a", text: para, marks: [] }],
    };
  });
}
