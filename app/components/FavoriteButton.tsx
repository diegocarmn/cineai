"use client";

import { FaStar, FaRegStar } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export default function FavoriteButton({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  className = "",
  size = "md",
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );

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

  const sizeClasses = {
    sm: "p-2",
    md: "p-2.5",
    lg: "p-3",
  };

  const buttonClass = `
    drop-shadow-lg transition-all duration-300 ease-out rounded-full hover:scale-110
    ${
      isLoading
        ? pendingAction === "add"
          ? "bg-green-500 text-white opacity-75 cursor-not-allowed"
          : "bg-red-500 text-white opacity-75 cursor-not-allowed"
        : isFavorite
        ? "bg-yellow-400 hover:bg-yellow-400 text-black cursor-pointer active:scale-95"
        : "bg-neutral-800 hover:bg-gray-500 text-white cursor-pointer active:scale-95"
    }
    ${sizeClasses[size]}
    ${className}
  `;

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      className={buttonClass}
      onClick={toggleFavorite}
      disabled={isLoading}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isLoading ? (
        <CgSpinner className={`${iconSize[size]} animate-spin`} />
      ) : isFavorite ? (
        <FaStar className={iconSize[size]} />
      ) : (
        <FaRegStar className={iconSize[size]} />
      )}
    </button>
  );
}
