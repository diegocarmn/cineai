"use client";

import { IoSearch } from "react-icons/io5";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import MediaCard from "../../components/MediaCard";
import { BeatLoading } from "respinner";

export type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
};

export default function SearchForm() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState<string>("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch("/api/user-favorites");
      const data = await res.json();
      setFavoriteIds(data.favorites);
    }

    fetchFavorites();
  }, []);

  async function searchMovies(event: React.FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("search") as string;
    if (!name) return;

    const res = await fetch(`/api/search?query=${encodeURIComponent(name)}`);
    const data = await res.json();
    setMovies(Array.isArray(data.results) ? data.results : []);
    setMovieName(name);
    setIsLoading(false);
  }

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
            type="text"
            id="search"
            name="search"
            placeholder="e.g. Fantastic Four"
            className="
              px-4 py-2 sm:py-3 sm:px-5 w-full text-sm font-normal 
              rounded-full bg-black/30 backdrop-blur-lg
              border border-white/10 
              focus:outline-none
              focus:border-cinema
            "
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
          <BeatLoading fill="#ffffff" count={3} size={15} />
        </div>
      ) : (
        <div>
          {Array.isArray(movies) && movies.length > 0 && (
            <>
              <h2 className="pt-8 text-body text-white/80 text-base text-center text-balance sm:text-lg md:text-xl">{`Search results for "${movieName}"`}</h2>
              <ul className="mt-4 flex flex-wrap justify-center gap-4 mx-4 md:mx-20 pt-5 md:pt-6 mb-5">
                {movies.map((movie: Movie, index: number) => (
                  <li key={index} className="pb-2">
                    <MediaCard
                      movie={movie}
                      isInitiallyFavorite={favoriteIds.includes(movie.id)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
          {Array.isArray(movies) && movies.length === 0 && movieName !== "" && (
            <p
              className="pt-10 md:pt-15 md:text-lg font-semibold text-center text-neutral-500 max-w-xs mx-auto truncate"
              title={movieName}
            >
              {`No results found for "${movieName}"`}
            </p>
          )}
        </div>
      )}
    </>
  );
}
