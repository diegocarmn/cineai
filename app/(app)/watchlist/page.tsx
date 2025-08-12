import { auth } from "../../api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import MyWatchlist from "./MyWatchlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist",
};

export default async function WatchlistPage() {
  const session = await auth();

  const watchlist = await prisma.watchlist.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  });

  return <MyWatchlist watchlist={watchlist} />;
}
