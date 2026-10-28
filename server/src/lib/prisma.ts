import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { env } from "../config/env";

/** One PrismaClient per process (tsx watch re-imports modules, so reuse it across reloads in dev). */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  // Prisma 7 talks to Postgres through a driver adapter (node-postgres) instead of a bundled engine.
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({ adapter, log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
