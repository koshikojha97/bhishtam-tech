import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error-handler";
import { notFound } from "./middleware/not-found";
import { router } from "./routes";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/", (_req, res) => {
    res.json({ name: "Bhishtam Tech API", version: "v1", docs: "/api/v1/health" });
  });
  app.use("/api/v1", router);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
