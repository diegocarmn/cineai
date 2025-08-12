"use client";

import { TbBookmark, TbBookmarkFilled } from "react-icons/tb";
import { CgSpinner } from "react-icons/cg";
import { useState } from "react";
import type { Movie } from "../types";

type Props = {
  movie: Movie;
  isInWatchlist: boolean;
  onWatchlistChange: (id: number, nextState: boolean) => void;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  pendingAction?: "add" | "remove" | null;
  onToggle?: (e: React.MouseEvent) => Promise<void>;
};

export default function BookmarkButton({
  movie,
  isInWatchlist,
  onWatchlistChange,
  onRemove,
  className = "",
  size = "md",
  isLoading: externalLoading,
  pendingAction: externalPendingAction,
  onToggle,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );

  // Use external loading state if provided, otherwise use internal state
  const currentLoading =
    externalLoading !== undefined ? externalLoading : isLoading;
  const currentPendingAction =
    externalPendingAction !== undefined ? externalPendingAction : pendingAction;

  async function toggleWatchlist(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent card expansion

    // If external toggle function is provided, use it instead
    if (onToggle) {
      await onToggle(e);
      return;
    }

    const nextState = !isInWatchlist;
    setPendingAction(nextState ? "add" : "remove");
    setIsLoading(true);

    try {
      const res = await fetch("/api/watchlist", {
        method: nextState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState ? movie : { tmdbId: movie.id }),
      });

      if (!res.ok) throw new Error(`${nextState ? "POST" : "DELETE"} failed`);

      if (!nextState) onRemove?.();
      onWatchlistChange(movie.id, nextState);
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
      currentLoading
        ? currentPendingAction === "add"
          ? "bg-green-500 text-white opacity-75 cursor-not-allowed"
          : "bg-red-500 text-white opacity-75 cursor-not-allowed"
        : isInWatchlist
        ? "bg-white hover:bg-cinema text-black cursor-pointer active:scale-95"
        : "bg-neutral-800 hover:bg-neutral-600 text-white cursor-pointer active:scale-95"
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
      onClick={toggleWatchlist}
      disabled={currentLoading}
      title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {currentLoading ? (
        <CgSpinner className={`${iconSize[size]} animate-spin`} />
      ) : isInWatchlist ? (
        <TbBookmarkFilled className={iconSize[size]} />
      ) : (
        <TbBookmark className={iconSize[size]} />
      )}
    </button>
  );
}
