import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ results: [] });

  const apiKey = process.env.TMDB_KEY;
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&api_key=${apiKey}&language=en-US&page=1&include_adult=false`
    );

    const data = await res.json();
    const movies = data.results || [];

    // Fetch trailers for each movie in parallel (limited for performance)
    const moviesWithTrailers = await Promise.all(
      movies.slice(0, 10).map(async (movie: Movie) => {
        const trailerInfo = await fetchMovieTrailer(movie.id, apiKey);
        return {
          ...movie,
          ...trailerInfo,
        };
      })
    );

    return NextResponse.json({ ...data, results: moviesWithTrailers });
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return NextResponse.json({ results: [] });
  }
}
