
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
              tmdbId: 550,
              title: "Fight Club",
              description: "A ticking-time-bomb insomniac...",
              releaseDate: new Date("1999-10-15"),
              posterPath: "/poster.jpg",
              backdropPath: "/backdrop.jpg",
              genreIds: [18, 53], // ← gêneros como números
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