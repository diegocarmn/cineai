"use client";

import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";
import { genreMap, getRatingStars, getTrailerUrl } from "../types";
import FavoriteButton from "./FavoriteButton";

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
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  const trailerUrl = getTrailerUrl(movie);

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
            <FavoriteButton
              movie={movie}
              isFavorite={isFavorite}
              onFavoriteChange={onFavoriteChange}
              onRemove={onRemove}
              size="sm"
            />
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
                <FavoriteButton
                  movie={movie}
                  isFavorite={isFavorite}
                  onFavoriteChange={onFavoriteChange}
                  onRemove={onRemove}
                  size="md"
                />
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
          <div className="flex-1">
            <h4 className="text-xs md:text-sm font-semibold font-body text-white mb-0.5 md:mb-1">
              Description
            </h4>
            <div className="h-16 md:h-20 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent hover:scrollbar-thumb-white/15 scrollbar-thumb-rounded-full">
              <p className="font-body text-xs md:text-xs md:pr-2 text-neutral-300 leading-relaxed">
                {movie.overview || "No description available."}
              </p>
            </div>
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
