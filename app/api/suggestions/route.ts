// app/api/suggestions/route.ts
import { NextResponse } from "next/server";
import type { Movie, TMDBVideo } from "@/app/types";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

// Fetch trailer for a specific movie
async function fetchMovieTrailer(movieId: number, apiKey: string) {
  try {
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
    const trailerRes = await fetch(trailerUrl);

    if (!trailerRes.ok) return null;

    const trailerData = await trailerRes.json();

    // Find official YouTube trailer with priority order
    const trailer =
      trailerData.results?.find(
        (video: TMDBVideo) =>
          video.site === "YouTube" && video.type === "Trailer"
      ) ||
      trailerData.results?.find(
        (video: TMDBVideo) =>
          video.site === "YouTube" && video.type === "Teaser"
      ) ||
      trailerData.results?.find(
        (video: TMDBVideo) => video.site === "YouTube" && video.type === "Clip"
      );

    return trailer
      ? {
          trailer_key: trailer.key,
          trailer_site: trailer.site,
        }
      : null;
  } catch (error) {
    console.error(`Error fetching trailer for movie ${movieId}:`, error);
    return null;
  }
}

/** Fetches TMDb recommendations for a single movie */
async function fetchMovieRecommendations(tmdbId: number) {
  const apiKey = process.env.TMDB_KEY;
  if (!apiKey) throw new Error("TMDB_KEY is not defined");

  const url = `https://api.themoviedb.org/3/movie/${tmdbId}/recommendations?api_key=${apiKey}&language=en-US`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDb recommendations request failed");

  const data = await res.json();
  const movies = data.results as Movie[];

  // Fetch trailers for each recommended movie
  const moviesWithTrailers = await Promise.all(
    movies.map(async (movie: Movie) => {
      const trailerInfo = await fetchMovieTrailer(movie.id, apiKey);
      return {
        ...movie,
        ...trailerInfo,
      };
    })
  );

  return moviesWithTrailers;
}

/* -------------------------------------------------------------------------- */
/* Route handler                                                              */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    /* 1. Check session ---------------------------------------------------- */
    const session = await auth();
    if (!session?.user?.email)
      return NextResponse.json(
        { message: "Authentication required", results: [] },
        { status: 401 }
      );

    /* 2. Fetch user favorites from DB ------------------------------------- */
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { favorites: { include: { movie: true } } },
    });

    if (!user || user.favorites.length === 0)
      return NextResponse.json({ results: [] });

    /* 3. Fetch recommendations for each favorite -------------------------- */
    const favoriteTmdbIds = new Set(user.favorites.map((fav) => fav.movie.id));
    const promises = user.favorites.map(
      (fav) =>
        fetchMovieRecommendations(fav.movie.id).then((arr) => arr.slice(0, 5)) // Agora usa 'id'
    );

    const settled = await Promise.allSettled(promises);
    const recArrays = settled
      .filter((r) => r.status === "fulfilled")
      .flatMap((r: PromiseFulfilledResult<Movie[]>) => r.value);

    /* 4. Deduplicate by TMDb id and filter out favorites ------------------ */
    const seen = new Set<number>();
    const unique: Movie[] = recArrays.filter((m) => {
      if (seen.has(m.id) || favoriteTmdbIds.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    /* 5. Shuffle, then sort by release year and limit to 18 --------------- */
    unique.sort(() => 0.5 - Math.random());
    unique.sort((a, b) => {
      const yearA = a.release_date ? parseInt(a.release_date.slice(0, 4)) : 0;
      const yearB = b.release_date ? parseInt(b.release_date.slice(0, 4)) : 0;
      return yearB - yearA;
    });
    const results: Movie[] = unique.slice(0, 18);

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Suggestions error:", err);
    return NextResponse.json(
      { message: "Internal Server Error", results: [] },
      { status: 500 }
    );
  }
}
