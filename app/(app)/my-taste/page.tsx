
import { auth } from "../../api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import MediaCard from "../../components/MediaCard";

export default async function MyListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <p className="text-center mt-10">
        You must be logged in to see your favorites.
      </p>
    );
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
  });

  return (
    <div className="flex flex-col items-center text-center px-4">
      <h1 className="text-3xl font-bold font-heading text-transparent bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-200 bg-clip-text md:text-7xl">
        My Taste
      </h1>

      <p className="pt-2 text-body text-base text-balance md:text-xl">
        Here you can find all the movies and shows you've added to your
        favorites list.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-4 mx-4 md:mx-20 pt-5 md:pt-10 mb-5">
        {favorites.map((fav) => {
          const movie = fav.movie;
          console.log("Session user id:", session.user.id);
          console.log("Favorites:", favorites);
          return (
            <MediaCard
              key={movie.id}
              movie={{
                id: movie.tmdbId,
                title: movie.title,
                release_date: movie.releaseDate.toISOString(),
                overview: movie.description,
                poster_path: movie.posterPath,
                backdrop_path: movie.backdropPath,
                genre_ids: movie.genreIds,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
