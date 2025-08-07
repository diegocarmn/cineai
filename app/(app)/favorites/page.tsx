import { auth } from "../../api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import MyFavorites from "./MyFavorites";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites",
};

export default async function MyListPage() {
  const session = await auth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
    orderBy: { createdAt: "desc" },
  });

  return <MyFavorites favorites={favorites} />;
}
