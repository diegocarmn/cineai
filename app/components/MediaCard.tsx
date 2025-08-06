"use client";

import Image from "next/image";
import Button from "./Button";
import { IoMdAdd, IoIosRemoveCircle } from "react-icons/io";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";

type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
};

type MediaCardProps = {
  movie: Movie;
  onRemove?: () => void;
  isInitiallyFavorite?: boolean;
};

const genreMap = new Map<number, string>([
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

export default function MediaCard({
  movie,
  onRemove,
  isInitiallyFavorite = false,
}: MediaCardProps) {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false); // <- controla o spinner

  async function handleToggleFavorite() {
    setIsLoading(true);

    if (isFavorite) {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tmdbId: movie.id }),
      });
      if (res.ok) {
        setIsFavorite(false);
        onRemove?.();
      } else console.error("Erro ao remover");
    } else {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          description: movie.overview,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path,
          backdropPath: movie.backdrop_path,
          genreIds: movie.genre_ids,
        }),
      });
      if (res.ok) setIsFavorite(true);
      else console.error("Erro ao favoritar");
    }
    setIsLoading(false);
  }

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  return (
    <div
      className="relative mx-2 mb-4 h-96 w-60 overflow-hidden rounded-3xl
                 flex items-end outline outline-white/20
                 transition-transform duration-100 ease-in-out hover:scale-110"
    >
      {/* POSTER */}
      <Image
        src={poster}
        alt={movie.title}
        fill
        className={`object-cover transition-opacity duration-300
                    ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setImgLoaded(true)}
        priority
      />

      {/* SPINNER */}
      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <CgSpinner className="h-10 w-10 animate-spin text-cinema/90" />
        </div>
      )}

      <Button
        className="absolute top-2 right-2 drop-shadow-lg z-20"
        onClick={handleToggleFavorite}
        secondary={isFavorite}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <CgSpinner className="h-4 w-4 animate-spin" />
            {isFavorite ? (
              <span className="ml-2">Removing...</span>
            ) : (
              <span className="ml-2">Adding...</span>
            )}
          </>
        ) : isFavorite ? (
          <>
            <IoIosRemoveCircle className="h-4 w-4 mr-1" /> Remove
          </>
        ) : (
          <>
            <IoMdAdd className="h-4 w-4 mr-1" /> Add
          </>
        )}
      </Button>

      <div className="z-10 w-full h-1/4 bg-black/40 backdrop-blur-lg px-4 pt-2 pb-4 flex flex-col justify-between">
        <div>
          <h3
            title={movie.title}
            className="line-clamp-1 text-ellipsis font-body text-xl font-semibold drop-shadow"
          >
            {movie.title}
          </h3>
          <p className="mb-2 text-sm font-body text-neutral-300 drop-shadow">
            {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
          </p>
        </div>

        <div className="flex">
          {movie.genre_ids.slice(0, 2).map((id) => (
            <span
              key={id}
              className="mr-2 rounded-full bg-white/10 px-2 py-1 text-xs leading-none font-body"
            >
              {genreMap.get(id)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
