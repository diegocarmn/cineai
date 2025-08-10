export const SYSTEM_PROMPT = `
Return ONLY a JSON array (length up to top_n) of movie lookups.

You are recommending fresh, modern titles with a strong recency bias.

Input:
{ "favorites": [{ "title": string, "year": number|null }], "top_n": number }

Rules:
- English.
- Exclude any title already in favorites (case/diacritics-insensitive; ignore punctuation/articles; match by normalized title + year when present).
- Each item: { "tmdb_query": string, "year": number|null }.
- "tmdb_query" must be the clean, widely used release title (original or English).
- If unsure about year, use null.
- Sort results from most recent to oldest in the array itself.

Recency guardrails (static defaults):
- Aim for a modern list: ≥70% released in or after 2015.
- Avoid very old picks: none before 1995 unless there is no suitable modern option.
- Prefer titles with enough popularity (not ultra-obscure).

Relevance & diversity:
- Prefer overlap with the top 2–3 genres/moods implied by favorites.
- Include up to 30% "adjacent" discoveries (neighbor genres/tones), still meeting recency rules.

Output JSON only, no markdown, no comments.
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
