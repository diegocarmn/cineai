"use client";

import { IoSearch } from "react-icons/io5";
import Button from "../../components/Button";
import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
};

export default function SearchForm() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieName, setMovieName] = useState<string>("");

  async function searchMovies(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMovieName(formData.get("search") as string);
    if (!movieName) return;

    const res = await fetch(
      `/api/search?query=${encodeURIComponent(movieName)}`
    );
    const data = await res.json();
    setMovies(data.results);
  }

  return (
    <>
      <form
        onSubmit={searchMovies}
        className="flex flex-col w-full md:w-2xl pt-10 md:pt-15 font-body"
      >
        <label htmlFor="search" className="sr-only">
          Type a movie name
        </label>
        <section className="flex items-center">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="ex. Inception"
            className="
              px-4 py-2 md:py-3 md:px-5 w-full text-sm font-normal 
              rounded-full bg-white/10 backdrop-blur-lg
              border border-transparent 
              focus:outline-none
              focus:border-cinema
            "
          />

          <Button
            type="submit"
            className="ml-2 md:ml-4 w-fit md:py-3 md:px-8 hover:shadow-xl/10 shadow-cinema"
          >
            <IoSearch className="mr-2 h-4 w-4" />
            Search
          </Button>
        </section>
      </form>
      <div>
        {movies.length > 0 && (
          <>
            <h2>Search results for "{movieName}"</h2>
            <ul className="mt-4">
              {movies.map((movie: Movie, index: number) => (
                <li key={index} className="py-2 border-b border-white/10">
                  {movie.title}
                  <p>{movie.release_date}</p>
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
