"use client";

import { useState } from "react";
import MediaCard from "../../components/MediaCard";

type Movie = {
  tmdbId: number;
  title: string;
  releaseDate: string | Date;
  description: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
};

type Favorite = {
  movie: Movie;
};

export default function MyTasteClient({
  favorites,
}: {
  favorites: Favorite[];
}) {
  const [favoriteMovies, setFavoriteMovies] = useState(favorites);

  return (
    <div className="flex flex-col items-center text-center px-4 md:pt-8">
      <h1
        className="text-3xl font-bold font-heading text-transparent text-center
          bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 
          bg-clip-text sm:text-5xl md:text-7xl"
      >
        My Taste
      </h1>

      <p className="pt-2 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        {`Here you can manage all the movies and shows you've added to your favorites list.`}
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-4 mx-4 md:mx-20 pt-5 md:pt-10 mb-5 text-left">
        {favoriteMovies.length === 0 ? (
          <p className="pt-10 font-semibold md:text-lg text-center text-neutral-500">
            {`Add movies to your list on the "Add Movies" page.`}
          </p>
        ) : (
          favoriteMovies.map((fav) => {
            const movie = fav.movie;
            if (!movie) return null;

            return (
              <MediaCard
                key={movie.tmdbId}
                movie={{
                  id: movie.tmdbId,
                  title: movie.title,
                  release_date:
                    typeof movie.releaseDate === "string"
                      ? movie.releaseDate
                      : movie.releaseDate?.toISOString(),
                  overview: movie.description,
                  poster_path: movie.posterPath,
                  backdrop_path: movie.backdropPath,
                  genre_ids: movie.genreIds,
                }}
                onRemove={() => {
                  setFavoriteMovies((prev) =>
                    prev.filter((f) => f.movie.tmdbId !== movie.tmdbId)
                  );
                }}
                isInitiallyFavorite={true}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
