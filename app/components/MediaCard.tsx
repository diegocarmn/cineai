import Button from "./Button";
import { IoMdAdd } from "react-icons/io";

type Movie = {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids: number[];
};

const genreMap = new Map<number, string>([
  [28, "Action"],
  [12, "Adventure"],
  [16, "Animation"],
  [35, "Comedy"],
  [80, "Crime"],
  [99, "Documentary"],
  [18, "Drama"],
  [10751, "Family"],
  [14, "Fantasy"],
  [36, "History"],
  [27, "Horror"],
  [10402, "Music"],
  [9648, "Mystery"],
  [10749, "Romance"],
  [878, "Sci-Fi"],
  [10770, "TV Movie"],
  [53, "Thriller"],
  [10752, "War"],
  [37, "Western"],
]);

const MediaCard = ({ movie }: { movie: Movie }) => {
  const bgImage = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/default-media.png";

  return (
    <div
      className="relative mx-2 mb-4 w-50 h-80 rounded-3xl overflow-hidden flex items-end outline outline-white/20 hover:scale-101 transition-transform duration-100 ease-in-out cursor-pointer"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Button className="absolute top-2 right-2 drop-shadow-lg hover:shadow-xl/10 shadow-cinema">
        <IoMdAdd className="h-4 w-4 mr-1" />
        Add
      </Button>
      <div className="z-10 text-white bg-black/40 w-full h-1/3 backdrop-blur-lg px-4 pt-1 pb-4">
        <h3
          title={movie.title}
          className="text-lg font-semibold drop-shadow line-clamp-1 overflow-hidden text-ellipsis"
        >
          {movie.title}
        </h3>

        <p className="text-sm text-neutral-300 drop-shadow mb-2">
          {movie.release_date?.slice(0, 4)}
        </p>
        {movie.genre_ids?.slice(0, 2).map((id) => (
          <span
            key={id}
            className="bg-white/10 px-2 mr-2 pb-1 pt-0.5 rounded-full leading-none text-xs"
          >
            {genreMap.get(id)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MediaCard;
