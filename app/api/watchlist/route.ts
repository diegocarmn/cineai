import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const movieData = await request.json();

    // Remove fields that don't exist in the schema
    const { media_type, ...cleanMovieData } = movieData;

    // Save movie if it doesn't exist
    await prisma.movie.upsert({
      where: { id: cleanMovieData.id },
      update: {},
      create: cleanMovieData,
    });

    // Add to watchlist
    const watchlistItem = await prisma.watchlist.create({
      data: {
        userId: session.user.id,
        movieId: cleanMovieData.id,
      },
    });

    return NextResponse.json({ success: true, watchlistItem });
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tmdbId } = await request.json();

    await prisma.watchlist.deleteMany({
      where: {
        userId: session.user.id,
        movieId: tmdbId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
