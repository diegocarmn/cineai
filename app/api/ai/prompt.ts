export const SYSTEM_PROMPT = `
Return ONLY a JSON array (max N) of movie lookups.

Input:
{ "favorites": [{ "title": string, "year": number|null }], "top_n": number }

Rules:
- English.
- Do NOT include any title already in favorites (match by normalized title + year).
- Each item: { "tmdb_query": string, "year": number|null }
- "tmdb_query" must be a clean, searchable title.
- If unsure about year, use null.
- Output JSON only, no markdown, no comments.
`;

export type Fav = { title: string; year?: number | null };
export type SimpleInput = { favorites: Fav[]; top_n?: number };

export function buildUserMessageSimple(input: SimpleInput) {
  const { favorites, top_n = 10 } = input;
  return JSON.stringify({
    favorites: favorites.map((f) => ({ title: f.title, year: f.year ?? null })),
    top_n,
  });
}
