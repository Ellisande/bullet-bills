import { PrismaClient } from "@prisma/client";

// this is to prevent us from making multiple connectsion during dev:
let prisma = getPrismaClient();

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return new PrismaClient();
  }
  if (prisma) return prisma;
  prisma = new PrismaClient();
  return prisma;
}

export { prisma };
