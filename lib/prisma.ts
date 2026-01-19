import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as { prisma?: PrismaClient };

const getPool = (): Pool => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({ connectionString });
};

const prismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
    adapter: new PrismaPg(getPool()),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
}

export const prisma = prismaClient;
