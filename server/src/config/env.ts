import "dotenv/config";
import { z } from "zod";

/** Validated environment. Fails fast at startup with a readable message instead of at first use. */
const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required (see .env.example)"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:\n", z.prettifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
