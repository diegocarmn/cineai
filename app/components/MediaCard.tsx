"use client";

import { useState } from "react";
import type { Movie } from "../types";
import CompactMediaCard from "./CompactMediaCard";
import ExpandedMediaCard from "./ExpandedMediaCard";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
  defaultExpanded?: boolean;
  isInWatchlist?: boolean;
  onWatchlistChange?: (id: number, nextState: boolean) => void;
  onWatchlistRemove?: () => void;
};

export default function MediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  defaultExpanded = false,
  isInWatchlist = false,
  onWatchlistChange,
  onWatchlistRemove,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isWatchlistLoading, setIsWatchlistLoading] = useState(false);
  const [favoritePendingAction, setFavoritePendingAction] = useState<
    "add" | "remove" | null
  >(null);
  const [watchlistPendingAction, setWatchlistPendingAction] = useState<
    "add" | "remove" | null
  >(null);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const nextFav = !isFavorite;
    setFavoritePendingAction(nextFav ? "add" : "remove");
    setIsFavoriteLoading(true);

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
      setIsFavoriteLoading(false);
      setFavoritePendingAction(null);
    }
  };

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const nextState = !isInWatchlist;
    setWatchlistPendingAction(nextState ? "add" : "remove");
    setIsWatchlistLoading(true);

    try {
      const res = await fetch("/api/watchlist", {
        method: nextState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState ? movie : { tmdbId: movie.id }),
      });

      if (!res.ok) throw new Error(`${nextState ? "POST" : "DELETE"} failed`);

      if (!nextState) onWatchlistRemove?.();
      onWatchlistChange?.(movie.id, nextState);
    } catch (err) {
      console.error(err);
    } finally {
      setIsWatchlistLoading(false);
      setWatchlistPendingAction(null);
    }
  };

  return (
    <div className="relative">
      <CompactMediaCard
        movie={movie}
        isFavorite={isFavorite}
        onFavoriteChange={onFavoriteChange}
        onRemove={onRemove}
        onClick={toggleExpanded}
        favoriteLoading={isFavoriteLoading}
        pendingAction={favoritePendingAction}
        onFavoriteToggle={handleFavoriteToggle}
        isInWatchlist={isInWatchlist}
        onWatchlistChange={onWatchlistChange}
        onWatchlistRemove={onWatchlistRemove}
        watchlistLoading={isWatchlistLoading}
        watchlistPendingAction={watchlistPendingAction}
        onWatchlistToggle={handleWatchlistToggle}
      />

      {isExpanded && (
        <ExpandedMediaCard
          movie={movie}
          isFavorite={isFavorite}
          onFavoriteChange={onFavoriteChange}
          onRemove={onRemove}
          onClick={toggleExpanded}
          favoriteLoading={isFavoriteLoading}
          pendingAction={favoritePendingAction}
          onFavoriteToggle={handleFavoriteToggle}
          isInWatchlist={isInWatchlist}
          onWatchlistChange={onWatchlistChange}
          onWatchlistRemove={onWatchlistRemove}
          watchlistLoading={isWatchlistLoading}
          watchlistPendingAction={watchlistPendingAction}
          onWatchlistToggle={handleWatchlistToggle}
        />
      )}
    </div>
  );
}
