# Grammar for IELTS — API (Phase 1A foundation)

Node.js + Express + MongoDB backend for Grammar for IELTS. This is the foundation only: configuration,
database connection, health checks, error handling, validation, security middleware and logging.
There is no authentication, no user data and no content API yet, and the React app does not call it.

It lives in `backend/` with its own `package.json`, lockfile and TypeScript config. The frontend's
lint, type check, tests, build and Vercel deployment do not include this directory.

## Requirements

- Node.js 22.12 or newer (CI uses Node 22)
- MongoDB, either a local `mongod` or a MongoDB Atlas cluster (hosting is not decided yet)

## Setup

```bash
cd backend
npm ci
cp .env.example .env   # then edit .env
```

`.env` is gitignored. Never commit real connection strings or passwords.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `MONGODB_URI` | yes | — | Must start with `mongodb://` or `mongodb+srv://` |
| `PORT` | no | `4000` | 1–65535 |
| `NODE_ENV` | no | `development` | `development`, `test` or `production` |
| `CORS_ORIGINS` | no | local Vite origins (`http://localhost:5173`, `:4173`, and the `127.0.0.1` forms) | Comma-separated exact origins; no paths, no `*` |
| `LOG_LEVEL` | no | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` |

The server validates these at startup. Missing or invalid values stop it with a list of problems
(names and rules only, never the values).

### Option A: local MongoDB

Install MongoDB Community Server and start `mongod`, or run it in Docker:

```bash
docker run --rm -p 27017:27017 mongo:8
```

Then in `.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/grammar-for-ielts
```

### Option B: MongoDB Atlas (free tier)

1. Create a free cluster in MongoDB Atlas.
2. Create a database user, and allow your IP address under Network Access.
3. Copy the connection string (Connect → Drivers) and put it in `.env`, with the database name
   added:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster-host>/grammar-for-ielts?retryWrites=true&w=majority
```

URL-encode special characters in the password.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start with reload on change (tsx) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled server (`node dist/server.js`) |
| `npm run typecheck` | Type-check source and tests |
| `npm run lint` | oxlint (same linter as the frontend) |
| `npm test` | Vitest + supertest. No MongoDB needed. |

Logs are JSON lines. For readable local output: `npm run dev | npx pino-pretty`.

## Endpoints

| Method and path | Response |
| --- | --- |
| `GET /api/health` | Liveness. Always `200 {"status":"ok"}`; does not touch the database. |
| `GET /api/health/ready` | Readiness. `200 {"status":"ok","database":"connected"}`, or `503 {"status":"unavailable","database":"<state>"}` while MongoDB is not connected. |

Any other path returns `404 {"error":{"code":"not_found","message":"Route not found"}}`.

## Behaviour

- **The database is not required to start.** The server listens immediately and connects to MongoDB
  in the background, retrying with backoff (2 s doubling to 30 s). `/api/health` works throughout;
  `/api/health/ready` returns 503 until the connection is up. Only invalid configuration stops the
  server.
- **Errors** all have the shape `{"error":{"code","message"}}`, plus `details` for validation
  errors. Malformed JSON → 400 `invalid_json`. Bodies over 100 kB → 413 `payload_too_large`.
  Unexpected errors → 500 `internal_error` with a generic message; the stack is included only when
  `NODE_ENV=development`.
- **Validation:** `validate({ params, query, body })` with Zod schemas. On failure it returns 400
  `validation_error` with the problem list. `src/validators/pagination.ts` is the example schema.
- **Security:**
  - Helmet headers and no `X-Powered-By`.
  - A JSON body limit.
  - A global rate limit of 300 requests per IP per 15 minutes, in memory; health checks are exempt.
  - CORS allowlist from `CORS_ORIGINS`; credentials are off until authentication is designed (see
    `src/middleware/cors.ts`).
- **Logging:** one line per request (id, method, URL, status, duration) with an `X-Request-Id`
  response header. Headers and bodies are never logged. Connection strings are redacted from
  database errors.
- **Shutdown:** on SIGTERM or SIGINT the server stops accepting connections, finishes in-flight
  requests, then closes the database connection. It exits after 10 s at most.

## Structure

```
src/
  server.ts          listen, background DB connect, graceful shutdown
  app.ts             createApp(deps): middleware and routes, no listen (used by tests)
  config/            env (Zod), logger (pino)
  controllers/       request handlers (health)
  middleware/        cors, rate limit, request logger, validate, error handler
  routes/            /api router
  services/          database connection
  validators/        reusable Zod schemas
  utils/             AppError, redaction
tests/               Vitest + supertest
```

`models/` will be added with the first Mongoose model in a later phase.
