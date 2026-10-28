# Bhishtam Tech — Server

Backend API for the Bhishtam Tech dashboard: **Express 5 + TypeScript + Prisma (PostgreSQL)**.

This is a scaffold. It boots, validates its config and exposes a health check. The Prisma schema already models the dashboard's data (alerts, incidents, assets, devices, vulnerabilities, users, notifications, subscriptions). Business endpoints are not built yet.

## Setup

```bash
cd server
npm install
cp .env.example .env          # set DATABASE_URL to your Postgres
npm run prisma:migrate        # creates the tables (first run asks for a migration name, e.g. "init")
npm run dev                   # http://localhost:4000
```

Check it: `GET http://localhost:4000/api/v1/health` returns `{ "status": "ok", "database": "up" | "down", … }`.
The API starts even without a database; `database` reports `"down"` until `DATABASE_URL` points at a reachable Postgres.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start with hot reload (`tsx watch`) |
| `npm run build` / `npm start` | Compile to `dist/` and run it |
| `npm run typecheck` | Type-check without emitting |
| `npm run prisma:migrate` | Create and apply a migration from `prisma/schema.prisma` |
| `npm run prisma:generate` | Regenerate the Prisma client |
| `npm run prisma:studio` | Browse the database in the browser |

## Layout

```
server/
├── prisma/schema.prisma      # database models (mirror client/src/lib/store.ts)
└── src/
    ├── index.ts              # starts the HTTP server, graceful shutdown
    ├── app.ts                # Express app: helmet, CORS, JSON, logging, routes, errors
    ├── config/env.ts         # zod-validated environment (fails fast on bad config)
    ├── lib/prisma.ts         # PrismaClient singleton
    ├── routes/               # URL → controller wiring; mounted under /api/v1
    ├── controllers/          # request/response handling
    ├── services/             # business logic + Prisma queries (add here)
    ├── middleware/           # not-found + JSON error handler
    └── utils/http-error.ts   # throw new HttpError(404, "…") from anywhere
```

## Adding an endpoint

1. `services/alerts.service.ts`: Prisma queries (`prisma.alert.findMany(...)`).
2. `controllers/alerts.controller.ts`: validate input with zod, call the service, `res.json(...)`.
3. `routes/alerts.routes.ts`: `alertsRouter.get("/", listAlerts)`.
4. Mount it in `routes/index.ts`: `router.use("/alerts", alertsRouter)`.

Thrown `HttpError`s and `ZodError`s are turned into JSON responses by `middleware/error-handler.ts`. With Express 5, async handlers don't need try/catch.

## Environment

See `.env.example`:

- `PORT` (default 4000)
- `CLIENT_ORIGIN`: the Next.js app's URL, allowed by CORS
- `DATABASE_URL`: the Postgres connection string
