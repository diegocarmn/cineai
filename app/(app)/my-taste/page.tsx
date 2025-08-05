import { auth } from "../../api/auth/[...nextauth]/auth";
import { prisma } from "@/prisma/prisma";
import MediaCard from "../../components/MediaCard";
import MyFavorites from "./MyFavorites"

export default async function MyListPage() {
  const session = await auth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { movie: true },
  });

  return (
    <MyFavorites favorites={favorites} />
  );
}
