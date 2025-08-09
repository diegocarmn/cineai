"use client";

import { useState } from "react";
import MediaCard from "../../components/MediaCard";
import type { Movie } from "../../types";

type Favorite = { movie: Movie };

export default function MyTasteClient({
  favorites,
}: {
  favorites: Favorite[];
}) {
  const favoriteMovies = favorites.map(({ movie }) => movie);
  const [movies, setMovies] = useState<Movie[]>(favoriteMovies);

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, nextFav: boolean) => {
    if (!nextFav) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    }
  };

  return (
    <div className="flex flex-col items-center text-center px-4 md:pt-8">
      <h1 className="text-3xl font-bold font-heading text-transparent bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 bg-clip-text sm:text-5xl md:text-7xl">
        My Favorites
      </h1>

      <p className="pt-2 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        {`Manage all the movies you've added to your favorites list.`}
      </p>

      <div className="mt-4 pt-5 md:pt-6 mb-5">
        {movies.length === 0 ? (
          <p className="pt-10 font-semibold md:text-lg text-center text-neutral-500">
            Add movies to your list on the Search page.
          </p>
        ) : (
          <ul className="flex flex-wrap justify-center gap-4 md:gap-10 text-left">
            {movies.map((movie) => (
              <li key={movie.id}>
                <MediaCard
                  movie={movie}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
