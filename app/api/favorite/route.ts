import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

// Define os tipos do corpo da requisição
type MovieBody = {
  tmdbId: number;
  title: string;
  description: string;
  releaseDate: string;
  posterPath: string | null;
  backdropPath: string | null;
  genreIds: number[];
};

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const {
    tmdbId,
    title,
    description,
    releaseDate,
    posterPath,
    backdropPath,
    genreIds,
  }: MovieBody = await req.json();

  try {
    const movie = await prisma.movie.upsert({
      where: { tmdbId: Number(tmdbId) }, // forçando tipo seguro
      update: {},
      create: {
        tmdbId: Number(tmdbId),
        title,
        description,
        releaseDate: new Date(releaseDate),
        posterPath,
        backdropPath,
        genreIds,
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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
