import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ favorites: [] });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      favorites: {
        include: { movie: true },
      },
    },
  });

  const favoriteIds = user?.favorites.map((fav) => fav.movie.id) || [];

  return NextResponse.json({ favorites: favoriteIds });
}
