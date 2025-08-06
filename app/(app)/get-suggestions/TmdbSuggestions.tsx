"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/app/components/MediaCard";
import { BeatLoading } from "respinner";
import type { Movie } from "@/app/types";

export default function SuggestionsClient() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/suggestions", { cache: "no-store" });

        if (res.status === 401) {
          setMessage("You must be signed in to see suggestions.");
          return;
        }

        const data = await res.json();
        if (data.results.length === 0) {
          setMessage("No favourites found to generate suggestions.");
        } else {
          setMovies(data.results);
        }
      } catch (err) {
        console.error("Suggestions fetch failed:", err);
        setMessage("Something went wrong while fetching suggestions.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
    <div className="mt-8">
      <h2 className="mb-10 text-center font-heading text-xl md:text-2xl bg-gradient-to-r from-yellow-50 via-yellow-200 to-yellow-50 text-transparent bg-clip-text w-fit mx-auto bg-[length:200%_200%] animate-[gradient-x_6s_ease-in-out_infinite]">
        Recommended for you
      </h2>

      <ul className="flex flex-wrap justify-center gap-4 mx-4 md:mx-20 text-left">
        {movies.map((m) => (
          <li key={m.id} className="pb-2">
            <MediaCard
              movie={m}
              /* starts unchecked; user can favourite from here */
              isFavorite={false}
              onFavoriteChange={() => {}}
              button={false}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
