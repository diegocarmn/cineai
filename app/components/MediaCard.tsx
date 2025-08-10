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
};

export default function MediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  defaultExpanded = false,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState<"add" | "remove" | null>(
    null
  );

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const nextFav = !isFavorite;
    setPendingAction(nextFav ? "add" : "remove");
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
      setPendingAction(null);
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
        pendingAction={pendingAction}
        onFavoriteToggle={handleFavoriteToggle}
      />

      {isExpanded && (
        <ExpandedMediaCard
          movie={movie}
          isFavorite={isFavorite}
          onFavoriteChange={onFavoriteChange}
          onRemove={onRemove}
          onClick={toggleExpanded}
          favoriteLoading={isFavoriteLoading}
          pendingAction={pendingAction}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
}
