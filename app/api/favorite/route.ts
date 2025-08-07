import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { Movie } from "@/app/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const movie: Movie = await req.json();

    // Use uma transação para garantir consistência
    const result = await prisma.$transaction(async (tx) => {
      // Buscar usuário e filme em paralelo
      const [user, existingMovie] = await Promise.all([
        tx.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true },
        }),
        tx.movie.findUnique({
          where: { id: movie.id },
          select: { id: true },
        }),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se já está nos favoritos (só se o filme existir)
      if (existingMovie) {
        const existingFavorite = await tx.favorite.findUnique({
          where: {
            userId_movieId: {
              userId: user.id,
              movieId: existingMovie.id,
            },
          },
        });

        if (existingFavorite) {
          return { message: "Already in favorites", status: 200 };
        }
      }

      // Create movie if it doesn't exist (using TMDB data directly)
      const movieRecord =
        existingMovie ||
        (await tx.movie.create({
          data: {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            genre_ids: movie.genre_ids,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            popularity: movie.popularity,
            adult: movie.adult,
            original_language: movie.original_language,
            original_title: movie.original_title,
            video: movie.video,
            trailer_key: movie.trailer_key,
            trailer_site: movie.trailer_site,
          },
          select: { id: true },
        }));

      // Adicionar aos favoritos
      await tx.favorite.create({
        data: {
          userId: user.id,
          movieId: movieRecord.id,
        },
      });

      return { message: "Favorited", status: 201 };
    });

    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  } catch (err) {
    console.error("Error in POST /api/favorite:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { tmdbId } = await req.json();

    // Buscar usuário e filme em paralelo, e deletar favorito em uma operação
    const result = await prisma.$transaction(async (tx) => {
      const [user, movie] = await Promise.all([
        tx.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true },
        }),
        tx.movie.findUnique({
          where: { id: Number(tmdbId) }, // Agora usa 'id' ao invés de 'tmdbId'
          select: { id: true },
        }),
      ]);

      if (!user) {
        throw new Error("User not found");
      }

      if (!movie) {
        return { message: "Movie not found", status: 404 };
      }

      // Deletar favorito
      const deleted = await tx.favorite.deleteMany({
        where: {
          userId: user.id,
          movieId: movie.id,
        },
      });

      return {
        message: deleted.count > 0 ? "Unfavorited" : "Not in favorites",
        status: 200,
      };
    });

    return NextResponse.json(
      { message: result.message },
      { status: result.status }
    );
  } catch (err) {
    console.error("Error in DELETE /api/favorite:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
