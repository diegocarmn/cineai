import Image from "next/image";
import type { Movie } from "../types";
import { getRatingStars, genreMap } from "../types";
import FavoriteButton from "./FavoriteButton";
import { IoIosArrowUp } from "react-icons/io";

type Props = {
  movie: Movie;
  isFavorite: boolean;
  onFavoriteChange: (id: number, nextFav: boolean) => void;
  onRemove?: () => void;
  onClick?: () => void;
  favoriteLoading?: boolean;
  pendingAction?: "add" | "remove" | null;
  onFavoriteToggle?: (e: React.MouseEvent) => Promise<void>;
};

function CompactMediaCard({
  movie,
  isFavorite,
  onFavoriteChange,
  onRemove,
  onClick,
  favoriteLoading = false,
  pendingAction = null,
  onFavoriteToggle,
}: Props) {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  return (
    <div
      className="relative h-80 aspect-[2/3] md:h-90 overflow-hidden rounded-3xl border border-white/10 hover:border-white/20 hover:scale-110 transition-transform duration-200 text-left"
      onClick={onClick}
    >
      <Image
        src={poster}
        alt={movie.title}
        fill
        sizes="(max-width: 768px) 96px, 160px"
      />

      {/* Favorite button */}
      <div className="text-right p-2">
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
      </div>

      {/* Expand button */}
      <button
        className="absolute bottom-2 right-2 z-20 text-white p-2 rounded-full cursor-pointer hover:scale-110 hover:text-cinema ease-in-out transition duration-200"
        title="View more"
        onClick={onClick}
      >
        <IoIosArrowUp className="h-5 w-5" />
      </button>

      {/* Movie info overlay */}
      <section className="absolute inset-0 backdrop-blur-lg bg-black/40 h-1/3 flex flex-col p-3 md:pt-2 mt-auto justify-between">
        <h3 className="text-md font-semibold font-body text-white line-clamp-1 md:text-lg">
          {movie.title}
        </h3>

        <span className="text-xs md:text-sm font-body text-neutral-300">
          {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
        </span>

        <span className="text-cinema mb-2 text-sm md:text-lg leading-none">
          {getRatingStars(movie.vote_average)}
        </span>

        <div className="flex flex-wrap gap-1">
          {movie.genre_ids.slice(0, 2).map((id) => (
            <span
              key={id}
              className="rounded-full bg-white/10 px-2 py-1 text-xs md:text-[11px] leading-none font-body text-white"
            >
              {genreMap.get(id)}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CompactMediaCard;
