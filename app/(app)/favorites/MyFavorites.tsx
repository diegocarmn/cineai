"use client";

import { useState, useEffect } from "react";
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
  const [watchlistIds, setWatchlistIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Load watchlist
        const watchRes = await fetch("/api/user-watchlist", {
          cache: "no-store",
        });
        const watchData = await watchRes.json();
        setWatchlistIds(watchData.watchlist ?? []);
      } catch (err) {
        console.error("Erro ao buscar dados da watchlist:", err);
      }
    })();
  }, []);

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, nextFav: boolean) => {
    if (!nextFav) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    }
  };

  // Handle watchlist change to update local state
  const handleWatchlistChange = (id: number, inWatchlist: boolean) => {
    setWatchlistIds((prev) =>
      inWatchlist ? [...prev, id] : prev.filter((x) => x !== id)
    );
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
          <ul className="mt-4 flex flex-wrap justify-center gap-4 md:gap-8 pt-5 md:pt-6 md:px-20 mb-5">
            {movies.map((movie) => (
              <li key={movie.id}>
                <MediaCard
                  movie={movie}
                  isFavorite={true}
                  onFavoriteChange={handleFavoriteChange}
                  isInWatchlist={watchlistIds.includes(movie.id)}
                  onWatchlistChange={handleWatchlistChange}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
