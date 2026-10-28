import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { HttpError } from "../utils/http-error";

/** Last middleware: turns thrown errors into JSON. Express 5 forwards async rejections here automatically. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { message: err.message, details: err.details } });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: "Validation failed", details: err.issues } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: "Internal server error", ...(env.NODE_ENV !== "production" && { stack: String(err?.stack ?? err) }) } });
};
