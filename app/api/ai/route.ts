import { NextResponse } from "next/server";
import { getUserFavorites } from "@/app/lib/user-helpers";
import { tmdbSearchFromGroqList } from "@/app/lib/tmdb-helpers";
import Groq from "groq-sdk";
import { SYSTEM_PROMPT, buildUserMessageSimple, SimpleInput } from "./prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

type GroqItem = { tmdb_query: string; year: number | null };

function safeParse<T>(txt: string): T | null {
  try {
    // Extract JSON array from the text
    const jsonMatch = txt.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

/**
 * Selects optimal favorites - if too many, takes recent ones + random selection
 */
function selectOptimalFavorites(
  favorites: Array<{
    title: string;
    year: number | null;
    createdAt?: Date;
  }>,
  maxCount: number = 20
) {
  if (favorites.length <= maxCount) {
    return favorites.map((fav) => ({ title: fav.title, year: fav.year }));
  }

  // Take 6 most recent
  const recentFavorites = favorites
    .sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 6);

  // Take random selection from the rest
  const remaining = favorites.filter(
    (fav) => !recentFavorites.some((recent) => recent.title === fav.title)
  );
  const shuffled = remaining.sort(() => Math.random() - 0.5);
  const randomSelection = shuffled.slice(0, maxCount - 6);

  const selected = [...recentFavorites, ...randomSelection];
  return selected.map((fav) => ({ title: fav.title, year: fav.year }));
}

async function getGroqMovieListSimple(input: SimpleInput): Promise<GroqItem[]> {
  // Calculate max_tokens based on requested count
  const baseTokens = 500;
  const tokensPerMovie = 25; // ~25 tokens per movie entry
  const maxTokens = Math.min(
    baseTokens + (input.count || 15) * tokensPerMovie,
    2000
  );

  const resp = await groq.chat.completions.create({
    model: "llama3-8b-8192",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserMessageSimple(input) },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const raw = resp.choices[0]?.message?.content ?? "[]";
  const data = safeParse<GroqItem[]>(raw) ?? [];
  return data.filter((it) => it?.tmdb_query && it.tmdb_query.trim().length > 0);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get("mood") || undefined;
    const user = await getUserFavorites();

    if (!user?.favorites.length) {
      return NextResponse.json(
        {
          message: "No favorites found to generate recommendations",
          results: [],
        },
        { status: 200 }
      );
    }

    const allFavorites = user.favorites.map((fav) => ({
      title: fav.movie.title,
      year: fav.movie.release_date
        ? parseInt(fav.movie.release_date.slice(0, 4))
        : null,
      createdAt: fav.createdAt,
    }));

    const selectedFavorites = selectOptimalFavorites(allFavorites, 20);

    const groqItems = await getGroqMovieListSimple({
      favorites: selectedFavorites,
      mood,
      count: 25, 
    });

    const movies = await tmdbSearchFromGroqList(groqItems);

    // Remove movies that are already in the user's favorites
    const favoriteIds = new Set(user.favorites.map((fav) => fav.movie.id));
    const filteredMovies = movies.filter((movie) => !favoriteIds.has(movie.id));

    // Remove duplicate movies using Set based on ID
    const uniqueMovies = Array.from(
      new Map(filteredMovies.map((movie) => [movie.id, movie])).values()
    );

    return NextResponse.json({ results: uniqueMovies });
  } catch (err) {
    console.error("AI suggestions error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", results: [] },
      { status: 500 }
    );
  }
}
