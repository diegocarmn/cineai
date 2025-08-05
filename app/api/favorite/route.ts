// app/api/favorite/route.ts
import { auth } from "@/app/api/auth/[...nextauth]/auth"; 
import { prisma } from "@/prisma/prisma"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const {
    tmdbId,
    title,
    description,
    releaseDate,
    posterPath,
    backdropPath,
    genreIds,
  } = body;

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId },
      update: {},
      create: {
        tmdbId,
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterPath,
        backdropPath,
        genreIds,
      },
    });

    // Adiciona como favorito
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    await prisma.favorite.create({
      data: {
        userId: user.id,
        movieId: movie.id,
      },
    });

    return NextResponse.json({ message: "Favorited" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error favoriting movie" },
      { status: 500 }
    );
  }
}
