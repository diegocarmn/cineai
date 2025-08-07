import { NextResponse } from "next/server";
import type { Movie, TMDBVideo } from "@/app/types";

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
        (video: TMDBVideo) => video.site === "YouTube" && video.type === "Trailer"
      ) ||
      trailerData.results?.find(
        (video: TMDBVideo) => video.site === "YouTube" && video.type === "Teaser"
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

export async function GET() {
  const apiKey = process.env.TMDB_KEY;
  if (!apiKey) {
    console.error("TMDB_KEY not set in environment variables");
    return NextResponse.json({ results: [] }, { status: 500 });
  }

  const url =
    `https://api.themoviedb.org/3/trending/movie/week` +
    `?language=en-US&api_key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // cache 1h

    if (!res.ok) {
      console.error("TMDb trending error:", res.status);
      return NextResponse.json({ results: [] }, { status: 500 });
    }

    const data = await res.json();
    const movies = (data.results ?? []).slice(0, 12);

    // Fetch trailers for each movie in parallel
    const moviesWithTrailers = await Promise.all(
      movies.map(async (movie: Movie) => {
        const trailerInfo = await fetchMovieTrailer(movie.id, apiKey);
        return {
          ...movie,
          ...trailerInfo,
        };
      })
    );

    return NextResponse.json({ results: moviesWithTrailers });
  } catch (error) {
    console.error("Error fetching trending:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
