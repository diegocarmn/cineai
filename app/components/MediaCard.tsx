type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
};

const MediaCard = ({ movie }: { movie: Movie }) => {
  const bgImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  return (
    <div
      className="relative w-50 h-80 rounded-2xl overflow-hidden flex items-end outline outline-white/20"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="z-10 text-white bg-black/30 w-full backdrop-blur-lg px-4 pt-1 pb-4">
        <h3
          title={movie.title}
          className="text-lg font-semibold drop-shadow line-clamp-2 overflow-hidden text-ellipsis"
        >
          {movie.title}
        </h3>
        <p className="text-sm text-white drop-shadow">
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </div>
  );
};

export default MediaCard;

