export const SYSTEM_PROMPT = `
You are a movie recommendation AI. Given a list of favorite movies, recommend similar movies in JSON format.

Return ONLY a JSON array of movie recommendations, no intro or comments, like this:
[
  {"tmdb_query": "Inception", "year": 2010},
  {"tmdb_query": "Interstellar", "year": 2014}
]

Rules:
- Recommend movies similar to the favorites
- Don't recommend movies that are already in the favorites list
- Use exact movie titles that exist on TMDB
- Include release year when known
- Recommend modern movies (2010+) when possible
`;

export type Fav = { title: string; year?: number | null };
export type SimpleInput = { favorites: Fav[]; mood?: string; count?: number };

export function buildUserMessageSimple(input: SimpleInput) {
  const { favorites, mood, count = 15 } = input;

  let message = `My favorite movies are:\n`;
  favorites.forEach((fav) => {
    message += `- ${fav.title}${fav.year ? ` (${fav.year})` : ""}\n`;
  });

  if (mood) {
    message += `\nPlease recommend movies with a ${mood} mood.`;
  }

  message += `\nRecommend ${count} similar movies in JSON format:`;

  return message;
}
