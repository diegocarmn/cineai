"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/app/components/MediaCard";
import { BeatLoading } from "respinner";
import type { Movie } from "@/app/types";

export default function GroqSuggestionsClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Fetch user favorites first
        const favRes = await fetch("/api/user-favorites", {
          cache: "no-store",
        });
        const favData = await favRes.json();
        setFavoriteIds(favData.favorites ?? []);

        // Then fetch AI suggestions
        const res = await fetch("/api/ai", { cache: "no-store" });

        if (res.status === 401) {
          setMessage("You must be signed in to see AI recommendations.");
          return;
        }

        const data = await res.json();
        if (data.results.length === 0) {
          setMessage("No favourites found to generate AI recommendations.");
        } else {
          setMovies(data.results);
        }
      } catch (err) {
        console.error("AI suggestions fetch failed:", err);
        setMessage("Something went wrong while fetching AI recommendations.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, isFav: boolean) => {
    setFavoriteIds((prev) =>
      isFav ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  /* UI ----------------------------------------------------------------- */
  if (isLoading)
    return (
      <div className="flex-1 flex mt-8 items-center justify-center">
        <BeatLoading fill="#ffffff" count={3} size={10} />
      </div>
    );

  if (message)
    return (
      <p className="pt-10 text-center text-neutral-500 font-semibold">
        {message}
      </p>
    );

  return (
    <div className="mt-4 pt-5 md:pt-6 mb-5">
      <h2 className="text-center font-heading text-xl md:text-2xl bg-gradient-to-r from-green-50 via-green-200 to-green-50 text-transparent bg-clip-text w-fit mx-auto bg-[length:200%_200%] animate-[gradient-x_6s_ease-in-out_infinite]">
        AI Recommendations
      </h2>

      <ul className="mt-4 flex flex-wrap justify-center gap-4 md:gap-8 pt-5 md:pt-6 md:px-10 lg:px-30 mb-5">
        {movies.map((m) => (
          <li key={m.id}>
            <MediaCard
              movie={m}
              isFavorite={favoriteIds.includes(m.id)}
              onFavoriteChange={handleFavoriteChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
