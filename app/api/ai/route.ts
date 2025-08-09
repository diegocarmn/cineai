import { NextResponse } from "next/server";
import { getUserFavorites } from "@/app/lib/user-helpers";
import { tmdbSearchFromGroqList } from "@/app/lib/tmdb-helpers";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, buildUserMessageSimple, SimpleInput } from "./prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

type GroqItem = { tmdb_query: string; year: number | null };

function safeParse<T>(txt: string): T | null {
  try {
    const cleaned = txt
      .trim()
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return null;
  }
}

/**
 * Selects optimal favorites with intelligent strategy:
 * 1. Maximum 30 favorites (optimized limit for Groq)
 * 2. If >30: takes 6 most recent + complements with genre/decade diversity
 * 3. Sends only title and year (essential data)
 */
function selectOptimalFavorites(
  favorites: Array<{ title: string; year: number | null; genre_ids: number[]; createdAt?: Date }>, 
  maxCount: number = 30
) {
  if (favorites.length <= maxCount) {
    return favorites.map(fav => ({ title: fav.title, year: fav.year }));
  }

  const recentCount = 6;
  const diversityCount = maxCount - recentCount;

  const recentFavorites = favorites
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, recentCount);

  const remainingFavorites = favorites.filter(
    fav => !recentFavorites.some(recent => recent.title === fav.title)
  );

  const diversityFavorites = selectForDiversity(remainingFavorites, diversityCount);

  const selected = [...recentFavorites, ...diversityFavorites];
  return selected.map(fav => ({ title: fav.title, year: fav.year }));
}

/**
 * Selects favorites prioritizing diversity of genres and decades
 */
function selectForDiversity(
  favorites: Array<{ title: string; year: number | null; genre_ids: number[] }>,
  count: number
) {
  if (favorites.length <= count) return favorites;

  const decadeGroups = new Map<string, typeof favorites>();
  favorites.forEach(fav => {
    const decade = fav.year ? `${Math.floor(fav.year / 10) * 10}s` : 'unknown';
    if (!decadeGroups.has(decade)) decadeGroups.set(decade, []);
    decadeGroups.get(decade)!.push(fav);
  });

  const genreGroups = new Map<number, typeof favorites>();
  favorites.forEach(fav => {
    const primaryGenre = fav.genre_ids[0] || 0;
    if (!genreGroups.has(primaryGenre)) genreGroups.set(primaryGenre, []);
    genreGroups.get(primaryGenre)!.push(fav);
  });

  const selected: typeof favorites = [];
  const usedTitles = new Set<string>();

  const decades = Array.from(decadeGroups.keys()).sort();
  const genres = Array.from(genreGroups.keys());

  let decadeIndex = 0;
  let genreIndex = 0;
  let useDecade = true;

  while (selected.length < count && (decades.length > 0 || genres.length > 0)) {
    if (useDecade && decades.length > 0) {
      const currentDecade = decades[decadeIndex % decades.length];
      const decadeMovies = decadeGroups.get(currentDecade)!;
      
      const available = decadeMovies.filter(movie => !usedTitles.has(movie.title));
      if (available.length > 0) {
        const randomMovie = available[Math.floor(Math.random() * available.length)];
        selected.push(randomMovie);
        usedTitles.add(randomMovie.title);
      }
      decadeIndex++;
    } else if (genres.length > 0) {
      const currentGenre = genres[genreIndex % genres.length];
      const genreMovies = genreGroups.get(currentGenre)!;
      
      const available = genreMovies.filter(movie => !usedTitles.has(movie.title));
      if (available.length > 0) {
        const randomMovie = available[Math.floor(Math.random() * available.length)];
        selected.push(randomMovie);
        usedTitles.add(randomMovie.title);
      }
      genreIndex++;
    }

    useDecade = !useDecade;
  }

  if (selected.length < count) {
    const remaining = favorites.filter(fav => !usedTitles.has(fav.title));
    const shuffled = remaining.sort(() => Math.random() - 0.5);
    const needed = count - selected.length;
    selected.push(...shuffled.slice(0, needed));
  }

  return selected;
}

async function getGroqMovieListSimple(input: SimpleInput): Promise<GroqItem[]> {
  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessageSimple(input) },
    ],
    temperature: 0.2,
    max_tokens: 400,
  });

  const raw = resp.choices[0]?.message?.content ?? "[]";
  const data = safeParse<GroqItem[]>(raw) ?? [];
  return data.filter((it) => it?.tmdb_query && it.tmdb_query.trim().length > 0);
}

export async function GET() {
  try {
    const user = await getUserFavorites();

    if (!user?.favorites.length) {
      return NextResponse.json(
        {
          message: "Authentication required",
          results: [],
        },
        { status: 401 }
      );
    }

    const allFavorites = user.favorites.map((fav) => ({
      title: fav.movie.title,
      year: fav.movie.release_date
        ? parseInt(fav.movie.release_date.slice(0, 4))
        : null,
      genre_ids: fav.movie.genre_ids || [],
      createdAt: fav.createdAt,
    }));

    const selectedFavorites = selectOptimalFavorites(allFavorites, 30);

    console.log(`🎬 AI Suggestions: ${selectedFavorites.length}/${allFavorites.length} favorites selected`);
    console.log(`📊 Strategy: ${allFavorites.length > 30 ? '6 recent + diversity' : 'All favorites'}`);

    const groqItems = await getGroqMovieListSimple({
      favorites: selectedFavorites,
      top_n: 12,
    });

    const movies = await tmdbSearchFromGroqList(groqItems);

    return NextResponse.json({ results: movies });
  } catch (err) {
    console.error("AI suggestions error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", results: [] },
      { status: 500 }
    );
  }
}
