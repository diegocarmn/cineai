"use client";

import Image from "next/image";
import { FaYoutube } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";
import { genreMap, getRatingStars, getTrailerUrl } from "../types";
import FavoriteButton from "./FavoriteButton";
import BookmarkButton from "./BookmarkButton";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
  onClick?: () => void;
  favoriteLoading?: boolean;
  pendingAction?: "add" | "remove" | null;
  onFavoriteToggle?: (e: React.MouseEvent) => Promise<void>;
  isInWatchlist?: boolean;
  onWatchlistChange?: (id: number, nextState: boolean) => void;
  onWatchlistRemove?: () => void;
  watchlistLoading?: boolean;
  watchlistPendingAction?: "add" | "remove" | null;
  onWatchlistToggle?: (e: React.MouseEvent) => Promise<void>;
};

export default function ExpandedMediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  onClick,
  favoriteLoading = false,
  pendingAction = null,
  onFavoriteToggle,
  isInWatchlist = false,
  onWatchlistChange,
  onWatchlistRemove,
  watchlistLoading = false,
  watchlistPendingAction = null,
  onWatchlistToggle,
}: Props) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "/default-media.png";

  const trailerUrl = getTrailerUrl(movie);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div
        className="flex flex-col md:flex-row text-left rounded-2xl bg-neutral-950 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 w-80 md:w-[800px] max-h-[90vh] overflow-hidden shadow-2xl shadow-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 z-20 text-white p-2 rounded-full cursor-pointer hover:scale-110 hover:text-cinema ease-in-out transition duration-200"
          title="Close"
          onClick={onClick}
        >
          <IoIosArrowDown className="h-5 w-5" />
        </button>

        {/* Poster Section */}
        <div className="relative h-48 md:h-auto md:w-80 md:aspect-[2/3] w-full overflow-hidden md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none flex-shrink-0">
          <Image
            src={poster}
            alt={movie.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            sizes="(max-width: 768px) 320px, 320px"
            priority
          />

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <CgSpinner className="h-8 w-8 animate-spin text-cinema/90" />
            </div>
          )}

          {/* Favorite and Bookmark Buttons */}
          <div className="absolute top-2 right-2 z-20 flex flex-col gap-2">
            <FavoriteButton
              movie={movie}
              isFavorite={isFavorite}
              onFavoriteChange={onFavoriteChange}
              onRemove={onRemove}
              size="md"
              isLoading={favoriteLoading}
              pendingAction={pendingAction}
              onToggle={onFavoriteToggle}
            />
            <BookmarkButton
              movie={movie}
              isInWatchlist={isInWatchlist}
              onWatchlistChange={onWatchlistChange || (() => {})}
              onRemove={onWatchlistRemove}
              size="md"
              isLoading={watchlistLoading}
              pendingAction={watchlistPendingAction}
              onToggle={onWatchlistToggle}
            />
          </div>
        </div>
        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2">
            {/* Title and Year */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3
                  title={movie.title}
                  className="text-xl md:text-2xl font-semibold font-body text-white line-clamp-2 md:pr-8"
                >
                  {movie.title}
                </h3>
                <p className="text-sm font-body text-neutral-400 mt-1">
                  {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <span className="text-cinema text-lg leading-none">
                {getRatingStars(movie.vote_average)}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genre_ids.slice(0, 4).map((id) => (
                <span
                  key={id}
                  className="rounded-full bg-white/10 px-3 py-1 md:py-2 md:px-4 text-xs leading-none font-body text-white"
                >
                  {genreMap.get(id)}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold font-body text-white mb-2">
                Description
              </h4>
              <div className="h-24 md:h-50 overflow-y-auto custom-scrollbar">
                <p className="font-body text-sm text-neutral-300 leading-relaxed pr-2">
                  {movie.overview || "No description available."}
                </p>
              </div>
            </div>
          </div>

          {/* Trailer Button */}
          {movie.trailer_key && (
            <button
              className="flex items-center gap-2 text-neutral-400 hover:text-red-500 transition-colors duration-200 pt-2 mt-auto self-start cursor-pointer"
              onClick={() => trailerUrl && window.open(trailerUrl, "_blank")}
            >
              <FaYoutube className="h-5 w-5" />
              <span className="text-sm font-body">Watch Trailer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
