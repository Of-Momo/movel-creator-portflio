import { LexoRank } from "lexorank";

/**
 * Matches @sanity/orderable-document-list's own initialRank() algorithm
 * (newItemPosition: "before"), so ranks created here sort correctly
 * alongside ones the Studio's drag-and-drop list creates.
 */
export function rankBefore(currentTopRank?: string | null): string {
  const base = currentTopRank ? safeParse(currentTopRank) : LexoRank.min();
  return base.genPrev().genPrev().toString();
}

function safeParse(value: string): LexoRank {
  try {
    return LexoRank.parse(value);
  } catch {
    return LexoRank.min();
  }
}
