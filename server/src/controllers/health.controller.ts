import type { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

/** Liveness + database reachability. Always 200 so the API is "up" even before Postgres is configured. */
export const getHealth: RequestHandler = async (_req, res) => {
  let database: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    // leave as "down"
  }
  res.json({ status: "ok", database, uptime: Math.round(process.uptime()), timestamp: new Date().toISOString() });
};
