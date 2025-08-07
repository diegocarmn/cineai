// app/api/favorite/check/route.ts
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ isFavorite: false });
  }

  const tmdbId = Number(req.nextUrl.searchParams.get("tmdbId"));

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const movie = await prisma.movie.findUnique({
    where: { id: tmdbId }, // Agora usa 'id' ao invés de 'tmdbId'
  });

  if (!user || !movie) {
    return NextResponse.json({ isFavorite: false });
  }

  const favorite = await prisma.favorite.findFirst({
    where: {
      userId: user.id,
      movieId: movie.id,
    },
  });

  return NextResponse.json({ isFavorite: !!favorite });
}
