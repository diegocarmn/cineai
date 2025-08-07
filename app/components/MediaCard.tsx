"use client";

import Image from "next/image";
import Button from "./Button";
import TrailerButton from "./TrailerButton";
import { IoMdAdd, IoIosRemoveCircle } from "react-icons/io";
import { FaPlay } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";
import {
  genreMap,
  formatRating,
  getRatingStars,
  getTrailerUrl,
} from "../types";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
};

export default function MediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  button = true,
}: Props & { button?: boolean }) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );
  const [imgLoaded, setImgLoaded] = useState(false);

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  async function toggleFavorite() {
    const nextFav = !isFavorite;
    setPendingAction(nextFav ? "add" : "remove");
    setIsLoading(true);

    try {
      if (!nextFav) {
        const res = await fetch("/api/favorite", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tmdbId: movie.id }),
        });
        if (!res.ok) throw new Error("DELETE failed");
        onRemove?.();
      } else {
        const res = await fetch("/api/favorite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movie),
        });
        if (!res.ok) throw new Error("POST failed");
      }

      onFavoriteChange(movie.id, nextFav);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }

  const trailerUrl = getTrailerUrl(movie);

  // Define secondary color based on loading state
  const secondaryColor = isLoading ? isFavorite : isFavorite;

  return (
    <div className="relative mx-2 mb-4 h-96 w-60 overflow-hidden rounded-3xl flex items-end outline outline-white/20 ring-inset ring-2 ring-white/20 hover:scale-110 transition-transform duration-150 ease-in-out">
      <Image
        src={poster}
        alt={movie.title}
        fill
        className={`object-cover transition-opacity duration-300 ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImgLoaded(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        priority
      />

      {!imgLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <CgSpinner className="h-10 w-10 animate-spin text-cinema/90" />
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex gap-2 z-20">
        {/* Favorite button */}
        {button && (
          <Button
            className="drop-shadow-lg"
            onClick={button ? toggleFavorite : undefined}
            secondary={secondaryColor}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CgSpinner className="h-4 w-4 animate-spin" />
                <span className="ml-2">
                  {pendingAction === "add" ? "Adding..." : "Removing..."}
                </span>
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
        )}
      </div>

      <div className="z-10 w-full h-30 bg-black/40 backdrop-blur-lg px-4 pt-2 pb-3 flex flex-col justify-between">
        <div>
          <h3
            title={movie.title}
            className="line-clamp-1 text-ellipsis font-body text-xl font-semibold drop-shadow"
          >
            {movie.title}
          </h3>
          <p className="text-sm font-body text-neutral-300 drop-shadow">
            {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
          </p>
          {movie.vote_average && movie.vote_average > 0 && (
            <div className="flex items-center gap-1 mb-1">
              <span className="text-cinema text-xl leading-none">
                {getRatingStars(movie.vote_average)}
              </span>
            </div>
          )}
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
      {/* Trailer button */}
      {movie.trailer_key && (
        <div className="absolute bottom-3 right-3 z-20">
          <TrailerButton
            trailerUrl={trailerUrl}
            className="drop-shadow-lg hover:text-white"
          >
            <FaPlay className="h-3 w-3 text-black" />
          </TrailerButton>
        </div>
      )}
    </div>
  );
}
