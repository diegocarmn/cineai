"use client";

import Image from "next/image";
import { FaStar, FaRegStar, FaYoutube } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";
import { genreMap, getRatingStars, getTrailerUrl } from "../types";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
  button?: boolean;
};

export default function MediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  button = true,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  const trailerUrl = getTrailerUrl(movie);

  async function toggleFavorite() {
    const nextFav = !isFavorite;
    setPendingAction(nextFav ? "add" : "remove");
    setIsLoading(true);

    try {
      const res = await fetch("/api/favorite", {
        method: nextFav ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextFav ? movie : { tmdbId: movie.id }),
      });

      if (!res.ok) throw new Error(`${nextFav ? "POST" : "DELETE"} failed`);

      if (!nextFav) onRemove?.();
      onFavoriteChange(movie.id, nextFav);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }

  const favoriteButtonClass = `
    drop-shadow-lg transition-all duration-300 ease-out rounded-full p-2 hover:scale-110
    ${
      isLoading
        ? pendingAction === "add"
          ? "bg-green-500 text-white opacity-75 cursor-not-allowed"
          : "bg-red-500 text-white opacity-75 cursor-not-allowed"
        : isFavorite
        ? "bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer active:scale-95"
        : "bg-neutral-800 hover:bg-gray-500 text-white cursor-pointer active:scale-95"
    }
  `;

  return (
    <div className="flex rounded-2xl md:rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-200 min-w-85 md:max-w-130 h-60 md:h-72 overflow-hidden hover:scale-110">
      {/* Poster */}
      <div className="relative h-60 w-40 md:h-72 md:w-48 flex-shrink-0 overflow-hidden rounded-l-2xl md:rounded-l-2xl">
        <Image
          src={poster}
          alt={movie.title}
          fill
          className={`object-cover transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImgLoaded(true)}
          sizes="(max-width: 768px) 96px, 160px"
          priority
        />

        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <CgSpinner className="h-8 w-8 animate-spin text-cinema/90" />
          </div>
        )}

        {/* Favorite button - Mobile only */}
        {button && (
          <div className="absolute top-2 left-2 z-20 md:hidden">
            <button
              className={favoriteButtonClass}
              onClick={toggleFavorite}
              disabled={isLoading}
            >
              {isLoading ? (
                <CgSpinner className="h-4 w-4 animate-spin" />
              ) : isFavorite ? (
                <FaStar className="h-4 w-4" />
              ) : (
                <FaRegStar className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-3 py-3 md:p-4">
        <div className="flex flex-col gap-1 md:gap-2">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 md:gap-3">
            <div className="flex-1 min-w-0">
              <h3
                title={movie.title}
                className="text-base md:text-xl font-semibold font-body text-white line-clamp-1"
              >
                {movie.title}
              </h3>
              <p className="text-xs md:text-sm font-body text-neutral-400 mt-0.5 md:mt-1">
                {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
              </p>
            </div>
            {/* Favorite button - Desktop only */}
            {button && (
              <div className="hidden md:block flex-shrink-0">
                <button
                  className={favoriteButtonClass}
                  onClick={toggleFavorite}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CgSpinner className="h-5 w-5 animate-spin" />
                  ) : isFavorite ? (
                    <FaStar className="h-5 w-5" />
                  ) : (
                    <FaRegStar className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-cinema text-sm md:text-lg leading-none">
              {getRatingStars(movie.vote_average)}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1 mb-2 md:gap-2">
            {movie.genre_ids.slice(0, 2).map((id) => (
              <span
                key={id}
                className="rounded-full bg-white/10 px-2 md:px-4 py-1 md:py-2 text-xs md:text-[11px] leading-none font-body text-white"
              >
                {genreMap.get(id)}
              </span>
            ))}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs md:text-sm font-semibold font-body text-white mb-0.5 md:mb-1">
              Description
            </h4>
            <p className="font-body text-xs md:text-xs md:pr-2 text-neutral-300 line-clamp-3  leading-relaxed overflow-hidden">
              {movie.overview || "No description available."}
            </p>
          </div>
        </div>

        {/* Trailer button */}
        {movie.trailer_key && (
          <button
            className="flex items-center gap-1 text-neutral-400 hover:text-red-500 transition-colors duration-200 py-1 mt-auto self-start cursor-pointer"
            onClick={() => trailerUrl && window.open(trailerUrl, "_blank")}
          >
            <FaYoutube className="h-4 w-4" />
            <span className="text-xs font-body">Watch Trailer</span>
          </button>
        )}
      </div>
    </div>
  );
}
