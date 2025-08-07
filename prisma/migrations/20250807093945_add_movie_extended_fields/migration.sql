-- AlterTable
ALTER TABLE "public"."movies" ADD COLUMN     "adult" BOOLEAN,
ADD COLUMN     "original_language" TEXT,
ADD COLUMN     "original_title" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "trailer_key" TEXT,
ADD COLUMN     "trailer_site" TEXT,
ADD COLUMN     "video" BOOLEAN,
ADD COLUMN     "vote_average" DOUBLE PRECISION,
ADD COLUMN     "vote_count" INTEGER;
