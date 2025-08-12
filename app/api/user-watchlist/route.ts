import { NextResponse } from "next/server";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const watchlist = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      select: { movieId: true },
    });

    const watchlistIds = watchlist.map((item) => item.movieId);
    return NextResponse.json({ watchlist: watchlistIds });
  } catch (error) {
    console.error("User watchlist fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
