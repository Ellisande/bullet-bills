import { PrismaClient } from "@prisma/client";

let lazyPrisma: any;

export function prisma(): PrismaClient {
  if (!lazyPrisma) {
    lazyPrisma = new PrismaClient();
  }
  return lazyPrisma;
}
