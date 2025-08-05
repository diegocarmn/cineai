/*
  Warnings:

  - A unique constraint covering the columns `[tmdbId]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "public"."Movie"("tmdbId");
