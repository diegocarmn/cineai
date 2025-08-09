import type { TMDBVideo } from "@/app/types";

// Fetch trailer for a specific movie
export async function fetchMovieTrailer(movieId: number, apiKey: string) {
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

// Search TMDB from Groq AI suggestions
type GroqItem = { tmdb_query: string; year: number | null };

export async function tmdbSearchFromGroqList(list: GroqItem[]) {
  const apiKey = process.env.TMDB_KEY!;
  const language = "en-US";

  const results = await Promise.all(
    list.map(async (it) => {
      const params = new URLSearchParams({
        api_key: apiKey,
        query: it.tmdb_query,
        include_adult: "false",
        language,
      });
      if (it.year) params.set("year", String(it.year));

      const r = await fetch(
        `https://api.themoviedb.org/3/search/movie?${params}`
      );
      const j = await r.json();
      const movie = j?.results?.[0];

      if (!movie) return null;

      // Fetch trailer for this movie
      const trailerInfo = await fetchMovieTrailer(movie.id, apiKey);

      return {
        ...movie,
        ...trailerInfo,
      };
    })
  );

  return results.filter(Boolean);
}
