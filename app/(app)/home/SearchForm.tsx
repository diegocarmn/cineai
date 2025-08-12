"use client";

import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import Button from "../../components/Button";
import MediaCard from "../../components/MediaCard";
import { BeatLoading } from "respinner";
import type { Movie } from "../../../app/types";

export default function SearchForm() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user-favorites", { cache: "no-store" });
        const data = await res.json();
        setFavoriteIds(data.favorites ?? []);
      } catch (err) {
        console.error("Erro ao buscar favoritos:", err);
      }
    })();
  }, []);

  // Fetch trending movies on initial load
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/trending", { cache: "no-store" });
        const data = await res.json();
        setMovies(data.results ?? []);
      } catch (err) {
        console.error("Erro ao buscar trending:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function searchMovies(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = (new FormData(e.currentTarget).get("search") as string).trim();
    if (!name) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(name)}`);
      const data = await res.json();
      setMovies(Array.isArray(data.results) ? data.results : []);
      setMovieName(name);
    } catch (err) {
      console.error("Erro na busca:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle favorite change to update local state
  const handleFavoriteChange = (id: number, isFav: boolean) => {
    setFavoriteIds((prev) =>
      isFav ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  return (
    <>
      <form
        onSubmit={searchMovies}
        className="flex flex-col w-full md:w-2xl sm:px-2 pt-10 md:pt-15 font-body"
      >
        <label htmlFor="search" className="sr-only">
          Type a movie name
        </label>
        <section className="flex items-center">
          <input
            id="search"
            name="search"
            placeholder="e.g. Fantastic Four"
            className="px-4 py-2 sm:py-3 sm:px-5 w-full text-sm font-normal rounded-full bg-black/30 backdrop-blur-lg border border-white/10 focus:outline-none focus:border-cinema"
          />
          <Button
            type="submit"
            className="ml-2 md:ml-4 w-fit sm:py-3 sm:px-8 hover:shadow-xl/10 shadow-cinema"
          >
            <IoSearch className="mr-2 h-4 w-4" />
            Search
          </Button>
        </section>
      </form>

      {isLoading ? (
        <div className="pt-10 flex flex-col items-center justify-center">
          <BeatLoading fill="#ffffff" count={3} size={10} />
        </div>
      ) : (
        <div>
          {movies.length > 0 ? (
            <>
              <h2
                className="
                  pt-8 mx-auto w-fit text-center font-heading font-bold
                  text-transparent text-xl md:text-2xl
                  bg-gradient-to-r from-yellow-50 via-yellow-200 to-yellow-50
                  bg-clip-text bg-[length:200%_200%]
                  animate-[gradient-x_6s_ease-in-out_infinite]
                "
              >
                {movieName
                  ? `Search results for "${movieName}"`
                  : `Popular this week`}
              </h2>
              <ul className="mt-4 flex flex-wrap justify-center gap-4 md:gap-8 pt-5 md:pt-6 md:px-20 mb-5">
                {movies.map((m) => (
                  <li key={m.id} className="">
                    <MediaCard
                      movie={m}
                      isFavorite={favoriteIds.includes(m.id)}
                      onFavoriteChange={handleFavoriteChange}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            movieName && (
              <p
                className="pt-10 md:pt-15 md:text-lg font-semibold text-center text-neutral-500 max-w-xs mx-auto truncate"
                title={movieName}
              >
                {`No results found for "${movieName}"`}
              </p>
            )
          )}
        </div>
      )}
    </>
  );
}
