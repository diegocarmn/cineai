"use client";

import { useState, useEffect } from "react";
import MediaCard from "../../components/MediaCard";
import type { Movie } from "../../types";

type WatchlistItem = { movie: Movie };

export default function MyWatchlist({
  watchlist,
}: {
  watchlist: WatchlistItem[];
}) {
  const watchlistMovies = watchlist.map(({ movie }) => movie);
  const [movies, setMovies] = useState<Movie[]>(watchlistMovies);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Load favorites
        const favRes = await fetch("/api/user-favorites", {
          cache: "no-store",
        });
        const favData = await favRes.json();
        setFavoriteIds(favData.favorites ?? []);
      } catch (err) {
        console.error("Erro ao buscar dados dos favoritos:", err);
      }
    })();
  }, []);

  // Handle watchlist change to update local state
  const handleWatchlistChange = (id: number, nextState: boolean) => {
    if (!nextState) {
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    }
  };

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, isFav: boolean) => {
    setFavoriteIds((prev) =>
      isFav ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  return (
    <div className="flex flex-col items-center text-center px-4 md:pt-8">
      <h1 className="text-3xl font-bold font-heading text-transparent bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 bg-clip-text sm:text-5xl md:text-7xl">
        My Watchlist
      </h1>

      <p className="pt-2 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl md:max-w-3xl">
        {`Here you can find all the movies you want to watch later.`}
      </p>

      <div className="mt-4 pt-5 md:pt-6 mb-5">
        {movies.length === 0 ? (
          <p className="pt-10 font-semibold md:text-lg text-center text-neutral-500">
            No movies found in your watchlist.
          </p>
        ) : (
          <ul className="flex flex-wrap justify-center gap-4 md:gap-10 text-left">
            {movies.map((movie) => (
              <li key={movie.id}>
                <MediaCard
                  movie={movie}
                  isFavorite={favoriteIds.includes(movie.id)}
                  onFavoriteChange={handleFavoriteChange}
                  isInWatchlist={true}
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
