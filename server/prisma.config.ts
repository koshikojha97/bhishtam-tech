import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Prisma 7 CLI config (migrate, studio, generate). The runtime client connects in src/lib/prisma.ts. */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
