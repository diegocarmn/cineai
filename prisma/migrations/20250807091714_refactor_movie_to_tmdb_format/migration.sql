/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `movieId` on the `Favorite` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."Favorite" DROP CONSTRAINT "Favorite_movieId_fkey";

-- AlterTable
ALTER TABLE "public"."Favorite" DROP COLUMN "movieId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."Movie";

-- CreateTable
CREATE TABLE "public"."movies" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "release_date" TEXT NOT NULL,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "genre_ids" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_movieId_key" ON "public"."Favorite"("userId", "movieId");

-- AddForeignKey
ALTER TABLE "public"."Favorite" ADD CONSTRAINT "Favorite_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "public"."movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
