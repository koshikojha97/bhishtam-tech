import { Router } from "express";
import { healthRouter } from "./health.routes";

/**
 * API v1. Add feature routers here as they're built, e.g.
 *   router.use("/alerts", alertsRouter);   // routes/alerts.routes.ts → controllers → services → prisma
 */
export const router = Router();

router.use("/health", healthRouter);
