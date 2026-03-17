// Esse é um script manual de seed/teste. NÃO é usado pela aplicação.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@prisma.io",
      image: "https://example.com/avatar.png",
      favorites: {
        create: {
          movie: {
            create: {
              id: 550, // Agora usa 'id' ao invés de 'tmdbId'
              title: "Fight Club",
              overview: "A ticking-time-bomb insomniac...", // Agora usa 'overview'
              release_date: "1999-10-15", // Agora usa string ao invés de Date
              poster_path: "/poster.jpg", // Agora usa 'poster_path'
              backdrop_path: "/backdrop.jpg", // Agora usa 'backdrop_path'
              genre_ids: [18, 53], // Agora usa 'genre_ids'
            },
          },
        },
      },
    },
  });

  const allUsers = await prisma.user.findMany({
    include: {
      favorites: {
        include: {
          movie: true,
        },
      },
    },
  });
  console.dir(allUsers, { depth: null });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
