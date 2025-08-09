import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";

export async function getUserFavorites() {
  const session = await auth();
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { movie: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getUserFavoritesWithGenres() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { movie: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    favorites: user.favorites.map((fav) => ({
      ...fav,
      movie: {
        ...fav.movie,
        genreCount: fav.movie.genre_ids?.length || 0,
        hasRareGenres: fav.movie.genre_ids?.some(id => [99, 36, 37, 10402, 10770].includes(id)) || false,
      }
    }))
  };
}
