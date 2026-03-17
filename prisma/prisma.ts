import { PrismaClient } from "@prisma/client";

const accelerateUrl = process.env.DATABASE_URL;
if (!accelerateUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl,
    log: ["query"], // debugging purposes
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
