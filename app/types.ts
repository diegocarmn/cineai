export type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];

  // Extended TMDB fields
  vote_average?: number; // Movie rating (0-10)
  vote_count?: number; // Number of votes
  popularity?: number; // Popularity score
  adult?: boolean; // Adult content flag
  original_language?: string; // Original language
  original_title?: string; // Original title
  video?: boolean; // Has video flag

  // Trailer fields
  trailer_key?: string; // YouTube video key
  trailer_site?: string; // Video site (YouTube, Vimeo, etc.)
};

// Generate YouTube trailer URL
export function getTrailerUrl(movie: Movie): string | null {
  if (movie.trailer_key) {
    // If no site specified or YouTube, assume YouTube
    if (!movie.trailer_site || movie.trailer_site === "YouTube") {
      return `https://www.youtube.com/watch?v=${movie.trailer_key}`;
    }
  }
  return null;
}

// Generate YouTube embed trailer URL
export function getTrailerEmbedUrl(movie: Movie): string | null {
  if (movie.trailer_key) {
    // If no site specified or YouTube, assume YouTube
    if (!movie.trailer_site || movie.trailer_site === "YouTube") {
      return `https://www.youtube.com/embed/${movie.trailer_key}`;
    }
  }
  return null;
}

// Format rating for display
export function formatRating(vote_average?: number): string {
  if (!vote_average) return "N/A";
  return `${vote_average.toFixed(1)}`;
}

// Generate visual rating stars
export function getRatingStars(vote_average?: number): string {
  if (!vote_average) return "☆☆☆☆☆";
  const stars = Math.round(vote_average / 2); // Convert from 0-10 to 0-5
  const fullStars = "★".repeat(stars);
  const emptyStars = "☆".repeat(5 - stars);
  return fullStars + emptyStars;
}

export const genreMap = new Map<number, string>([
  [28, "Action"],
  [12, "Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [14, "Fantasy"],
  [36, "History"],
  [27, "Horror"],
  [10402, "Music"],
  [9648, "Mystery"],
  [10749, "Romance"],
  [878, "Sci-Fi"],
  [10770, "TV Movie"],
  [53, "Thriller"],
  [10752, "War"],
  [37, "Western"],
]);
