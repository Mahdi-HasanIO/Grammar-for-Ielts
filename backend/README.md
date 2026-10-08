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
| `TRUST_PROXY` | no | `0` | Number of reverse proxies in front of the API (0–10). Set to the host's real count (often 1) so per-IP rate limits see the client IP; too high lets clients spoof it |
| `MONGODB_MAX_POOL_SIZE` / `MONGODB_MIN_POOL_SIZE` | no | `10` / `0` | Driver connection pool bounds |
| `MONGODB_SERVER_SELECTION_TIMEOUT_MS` | no | `5000` | How long an operation waits for a usable server |
| `MONGODB_CONNECT_TIMEOUT_MS` / `MONGODB_SOCKET_TIMEOUT_MS` | no | `10000` / `45000` | Connection and socket timeouts (`0` = no socket timeout) |
| `ADMIN_EMAILS` | no | — | Comma-separated addresses that act as admins once their email is verified |
| `GEMINI_API_KEY` | for AI | — | Server-held Gemini key. Without it `/api/ai/*` answers `503 ai_not_configured`. Secret |
| `GEMINI_MODEL` | no | `gemini-3.5-flash-lite` | Model ID from https://ai.google.dev/gemini-api/docs/models (`gemini-flash-latest` follows the newest Flash) |
| `GEMINI_TIMEOUT_MS` | no | `30000` | Per AI request |
| `AI_RATE_LIMIT_PER_MINUTE` | no | `10` | Per user: AI requests per minute |
| `AI_DAILY_QUOTA` / `AI_DAILY_QUOTA_PREMIUM` | no | `20` / `200` | AI requests per UTC day on the free and premium plans |
| `APP_BASE_URL` | in production | `http://localhost:5173` | Frontend URL that links in emails point to (`/verify-email#token=…`, `/reset-password#token=…`) |
| `MAIL_TRANSPORT` | no | `log` | `log` writes emails to the log (the body, with its link, only outside production); `resend` sends through the Resend API |
| `MAIL_FROM` | with `resend` | — | Sender, e.g. `Grammar for IELTS <no-reply@your-domain>` (the domain must be verified in Resend) |
| `RESEND_API_KEY` | with `resend` | — | Resend API key. Secret: only in `.env` or the host's settings |
| `SESSION_COOKIE_NAME` | no | `gfi_session` | Name of the session cookie. In production over HTTPS, `__Host-gfi_session` makes browsers enforce Secure, `Path=/` and no `Domain` |

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
| `npm run admin:grant -- <email> [--revoke]` | Give (or take away) the stored admin role; audited. The only way to store it |
| `npm run seed:content` | Validate `seed/*.json` and upsert it into MongoDB (idempotent). `-- --check` validates only, without a database |

Opt-in integration tests run against a real MongoDB when `MONGODB_URI_TEST` is set. They use a
throwaway database (`grammar-ielts-it-<random>`) and drop it afterwards. CI never sets it.

```bash
MONGODB_URI_TEST="$(sed -n 's/^MONGODB_URI=//p' .env)" npm test
```

Logs are JSON lines. For readable local output: `npm run dev | npx pino-pretty`.

## Endpoints

| Method and path | Response |
| --- | --- |
| `GET /api/health` | Liveness. Always `200 {"status":"ok"}`; does not touch the database. |
| `GET /api/health/ready` | Readiness. `200 {"status":"ok","database":"connected"}`, or `503 {"status":"unavailable","database":"<state>"}` while MongoDB is not connected. |
| `POST /api/auth/register` | Body `{"email","password"}`. `201 {"user"}` and sets the session cookie. `409 email_taken` if the email exists. |
| `POST /api/auth/login` | Body `{"email","password"}`. `200 {"user"}` and sets the session cookie. `401 invalid_credentials` for a wrong password or unknown email (same response). |
| `POST /api/auth/logout` | Ends the session and clears the cookie. Always `204`. |
| `GET /api/auth/me` | `200 {"user"}` for a valid session, otherwise `401 unauthenticated`. |
| `POST /api/auth/forgot-password` | Body `{"email"}`. Always `202` with the same message; a reset link (30 minutes) is emailed only if the account exists. |
| `POST /api/auth/reset-password` | Body `{"token","password"}`. `204`; sets the password and ends every session. `400 invalid_token` if the link is wrong, used or expired. |
| `POST /api/auth/request-verification` | Signed in. `202`; emails a new verification link (24 hours). `409 already_verified`, `502 email_failed`. |
| `POST /api/auth/verify-email` | Body `{"token"}`. `204`; sets `emailVerifiedAt`. `400 invalid_token`. |
| `POST /api/auth/change-password` | Signed in. Body `{"currentPassword","newPassword"}`. `204`; ends every other session. `400 invalid_current_password`. |
| `GET /api/profile` | Signed in. `200 {"profile"}`. |
| `PATCH /api/profile` | Signed in. Any of `displayName` (1–50), `targetBand` (4.0–9.0 in 0.5 steps), `examDate` (`YYYY-MM-DD`), `timezone` (IANA name), `dailyGoalMinutes` (1–600), `language` (`en`/`bn`); `null` clears a field; other fields are rejected. `200 {"profile"}`. |

| `GET /api/progress` / `GET /api/bookmarks` | Signed in. `200 {"progress" or "bookmarks", "version", "updatedAt"}`; `null` and version `0` before the first save. |
| `PUT /api/progress` / `PUT /api/bookmarks` | Signed in. Body `{"baseVersion", "progress" or "bookmarks"}`. `200` with the saved data, the new `version` and `merged`. See "Sync" below. |

| `GET /api/content/modules` | Public. `{"stages","modules"}` in course order. |
| `GET /api/content/modules/:ref` | Public. `:ref` is a legacy id (`3`), a module slug or a topic slug (`articles`). `{"module"}`, or 404. |
| `GET /api/content/modules/:ref/lesson?language=bn\|en` | Public. `{"lesson"}` (Bangla by default). |
| `GET /api/content/modules/:ref/questions?set=practice\|test` | Public. `{"questions"}` in order (both sets without `set`). |
| `GET /api/content/blog` / `GET /api/content/blog/:slug` | Public. Posts newest first without bodies / one post with its body. |

| `GET /api/admin/content/:collection` | Admin. `:collection` is `stages`, `modules`, `lessons`, `questions` or `posts`. `{"documents"}`. |
| `GET/PUT/DELETE /api/admin/content/:collection/:key` | Admin. `:key` is the stage id, module legacy id, `<moduleId>-<language>` for lessons, question id or post slug. PUT takes the whole document: `201` created or `200`; `400` invalid, `422` bad references or a slug change, `409` duplicate slug. DELETE: `204`, or `409 in_use` while other content points at it. |
| `GET /api/admin/audit?limit=&before=` | Admin. Audit entries, newest first. |

| `GET /api/ai/quota` | Signed in. `{"configured","quota":{"used","limit","resetsAt"}}`. |
| `POST /api/ai/check-sentence` | Signed in. Body `{"sentence"` (≤ 500 chars), `"language"` (`en`/`bn`)`}`. `{"result":{"isCorrect","corrected","explanation","mistakes"},"quota"}`. |
| `POST /api/ai/practice` | Signed in. Body `{"module"` (id or slug), `"count"` (1–10), `"language"`, `"avoid"` (≤ 30 earlier questions)`}`. `{"questions","quota"}`: app-shaped questions marked `source: "ai"`. |

| `GET /api/entitlements` | Signed in. `{"plan","planExpiresAt","limits","usage"}`. |
| `GET /api/admin/users?email=` | Admin. Finds an account (to grant a plan). |
| `PUT /api/admin/users/:id/plan` | Admin. Body `{"plan": "free"\|"premium", "expiresAt"?}`. Audited. |

`user` is `{"id","email","emailVerifiedAt","role","plan","createdAt"}`; `plan` is the effective plan. `profile` is `{"email","emailVerifiedAt"}` plus
the six profile fields (`null` when unset). Emails are trimmed and lowercased; passwords must be
10–128 characters. Invalid input returns `400 validation_error`.

Any other path returns `404 {"error":{"code":"not_found","message":"Route not found"}}`.

## Behaviour

- **The database is not required to start.** The server listens immediately and connects to MongoDB
  in the background, retrying with backoff (2 s doubling to 30 s). `/api/health` works throughout;
  `/api/health/ready` returns 503 until the connection is up. Only invalid configuration stops the
  server.
- **Errors** all have the shape `{"error":{"code","message","requestId"}}`, plus `details` for
  validation errors. `requestId` equals the `X-Request-Id` response header and the `reqId` on the
  matching log lines. Malformed JSON → 400 `invalid_json`. Bodies over 100 kB → 413 `payload_too_large`.
  While MongoDB is unreachable, routes that need it (all of `/api/auth/*`) return 503
  `service_unavailable`. Unexpected errors → 500 `internal_error` with a generic message; the stack
  is included only for those, and only when `NODE_ENV=development`.
- **Validation:** `validate({ params, query, body })` with Zod schemas. On failure it returns 400
  `validation_error` with the problem list. `src/validators/pagination.ts` is the example schema.
- **Security:**
  - Helmet headers and no `X-Powered-By`.
  - Responses over 1 kB are compressed (gzip, deflate or brotli) when the client accepts it.
  - A JSON body limit.
  - A global rate limit of 300 requests per IP per 15 minutes, in memory; health checks are exempt.
  - CORS allowlist from `CORS_ORIGINS`, with credentials allowed for those origins only.
- **Authentication** (`src/services/auth.ts`):
  - Passwords are hashed with argon2id (19 MiB, 2 iterations, 1 lane: the OWASP baseline).
  - A session is a random 32-byte token in an httpOnly, `SameSite=Lax`, `Path=/` cookie that lasts
    14 days and is `Secure` in production. MongoDB stores only the token's SHA-256, with a TTL index
    that deletes expired sessions; expiry is also checked on every request.
  - Login with an unknown email still runs a password check against a dummy hash, so response time
    does not reveal which emails are registered.
  - CSRF: `register`, `login` and `logout` require `Content-Type: application/json` (415 otherwise)
    and reject an `Origin` header that is not in `CORS_ORIGINS` (403).
  - `/api/auth/*` and `/api/profile` share a rate limit of 50 requests per IP per 15 minutes, on
    top of the global one.
  - One-time links (`src/services/account.ts`): a random 32-byte token in the URL fragment (never
    sent to a server), stored only as its SHA-256 in `account_tokens` with a TTL index. One per
    user and type, so a new request invalidates the previous link; each works once.
  - At most one email of each kind per address per minute: a repeated forgot-password is answered
    202 as usual but sends nothing (for registered and unknown addresses alike); a repeated
    request-verification is `429 email_cooldown`. In memory, so per instance (TODO: shared store).
  - Register and forgot-password send email in the background, so a slow or failing provider
    neither delays nor fails them, and forgot-password's timing does not reveal accounts.
  - `requireAuth` (`src/middleware/requireAuth.ts`) protects later routes; handlers read the user
    with `getAuth(res)`.
- **Sync** (`/api/progress`, `/api/bookmarks`; `src/services/sync.ts`, `src/services/merge.ts`):
  - One document per user per kind, in the frontend's version-1 shapes, validated by
    `src/validators/progress.ts` (a copy of the frontend's rules and caps; unknown fields are dropped).
  - `version` grows by one per write. A `PUT` whose `baseVersion` equals the stored version replaces
    the data. Otherwise another device wrote in between, and the two are merged: progress only moves
    forward (completion and views kept, higher scores and counts, attempts and badges united,
    per-day activity takes the larger figure), bookmarks are united by path (later `savedAt` wins).
    Nothing is dropped; a bookmark deleted on a stale device comes back. If the merge would exceed
    the caps, `422 sync_limit_exceeded` and nothing changes.
  - Writes are compare-and-set on `{userId, version}`, retried on a race, `409 sync_conflict` after
    five losses.
  - Request bodies up to 5 MB on these two routes (100 kB elsewhere).
- **Content** (`/api/content/*`; `src/services/content.ts`, `src/services/contentSeed.ts`):
  - The React app's static content stays the source for SEO and offline use. The content API
    serves a copy from MongoDB, for later admin editing.
  - `node scripts/export-content-snapshot.mjs` (repository root) reads the app's content through
    Vite and writes `backend/seed/*.json`, which are committed; `--check` reports stale snapshots.
    The backend reads only those files and never imports from `src/`
    (`tests/importBoundary.test.ts` fails if it does).
  - `npm run seed:content` validates the snapshots with rules mirroring the app's content tests
    (unique ids and slugs, kebab-case slugs, references, answers among the options, Bangla/English
    lesson parity, 4 practice and 10 test questions per module), refuses to change a stored module
    slug, and upserts. Documents not in the snapshot are left alone.
  - Responses carry `Cache-Control: public, max-age=300`.
- **Admin** (`/api/admin/*`; `src/services/adminContent.ts`):
  - `role` is `user` or `admin`. Admin comes only from `npm run admin:grant` or from
    `ADMIN_EMAILS` for a verified address; no API can grant it. Every admin route answers 401
    without a session and 403 for non-admins.
  - Content writes use the seed's document schemas plus reference checks (module and stage exist,
    related topics exist, rule ids belong to the module, slugs never change).
  - Every change (and every role grant) is appended to `audit_log` with the actor and the document
    before and after.
- **AI** (`/api/ai/*`; `src/services/ai/`):
  - Gemini through its REST API (`generateContent`, key in the `x-goog-api-key` header, never in a
    URL), with the server's key: learners no longer need their own.
  - Per user: a rate limit (default 10 per minute) and a daily quota (default 20, reset 00:00 UTC),
    counted atomically in `usage_counters`. A failed provider call gives the unit back.
  - Input caps (sentence 500 characters, 10 questions, 30 earlier questions to avoid); user text is
    wrapped in tags the instructions say to treat as data.
  - Clients never see provider messages, model names or keys: `503 ai_unavailable` (busy or timed
    out), `422 ai_blocked`, `502 ai_bad_response` / `ai_failed`, `429 ai_quota_exceeded`. The log keeps
    only the failure kind, provider status and model.
  - Generated practice questions that the app could not grade (answer not among distinct options, a
    blank without ___) are dropped.
- **Plans** (`src/config/plans.ts`, `src/services/entitlements.ts`):
  - `plan` is `free` or `premium`, with an optional `planExpiresAt`; past that date the user is on
    free again. Only an admin (or, later, a verified payment webhook) sets it.
  - Limits per plan come from env (`AI_DAILY_QUOTA*`); daily usage is counted in `usage_counters`.
  - `requirePlan('premium')` guards a feature on the server (`403 plan_required`), from the stored
    plan only.
  - Payments: `src/services/payments.ts` is only the provider interface and a stub that answers
    `503 payments_not_configured`; no provider and no routes yet.
- **Logging:** one line per request (id, method, URL, status, duration) with an `X-Request-Id`
  response header; every other line logged during the request carries the same id as `reqId`. Headers and bodies are never logged. Connection strings are redacted from
  database errors.
- **Shutdown:** on SIGTERM or SIGINT the server stops accepting connections, finishes in-flight
  requests, then closes the database connection. It exits after 10 s at most.

## Structure

```
src/
  server.ts          listen, background DB connect, graceful shutdown
  app.ts             createApp(deps): middleware and routes, no listen (used by tests)
  config/            env (Zod), logger (pino)
  controllers/       request handlers (health, auth, profile)
  middleware/        cors, csrf, rate limits, request logger, validate, requireAuth, requireDatabase, error handler
  models/            Mongoose schemas (User, Session, AccountToken, progress and bookmarks)
  repositories/      persistence interfaces, MongoDB implementation, in-memory implementation for tests
  routes/            /api router, /api/auth, /api/profile, /api/progress and /api/bookmarks
  services/          database connection, auth, account (verification, reset, password change),
                     profile, mailer (log, Resend), password hashing
  validators/        reusable Zod schemas
  utils/             AppError, redaction, session cookie
  scripts/           seed-content (CLI)
seed/                content snapshots exported from the app (JSON, committed)
tests/               Vitest + supertest (*.integration.test.ts need MONGODB_URI_TEST)
```

Every MongoDB index is listed, with the query it serves, in a comment above its schema in
`src/models/`; `tests/indexes.test.ts` fails if a schema and its list drift apart.
