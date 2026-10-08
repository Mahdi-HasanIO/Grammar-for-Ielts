import compression from 'compression'
import express, { type Express } from 'express'
import helmet from 'helmet'
import type { Env } from './config/env.js'
import type { Logger } from './config/logger.js'
import { corsMiddleware } from './middleware/cors.js'
import { createErrorHandler, notFound } from './middleware/errorHandler.js'
import { rateLimiter, type RateLimitOptions } from './middleware/rateLimit.js'
import { requestLogger } from './middleware/requestLogger.js'
import { createApiRouter } from './routes/index.js'
import type { AccountService } from './services/account.js'
import type { AuthService } from './services/auth.js'
import type { DatabaseStatus } from './services/database.js'
import type { ProfileService } from './services/profile.js'
import type { SyncServices } from './routes/index.js'
import type { ContentService } from './services/content.js'

/** JSON request bodies above this size get 413. Generous for API payloads, small enough to limit abuse. */
export const JSON_BODY_LIMIT = '100kb'

/**
 * Larger limit for the synced documents (progress, bookmarks), whose item
 * caps mirror the frontend's. The longest-lived learners stay far below it;
 * well under MongoDB's 16 MB document limit.
 */
export const SYNC_BODY_LIMIT = '5mb'
const SYNC_PATHS = /^\/api\/(progress|bookmarks)(\/|$)/

export interface AppDependencies {
  env: Pick<Env, 'NODE_ENV' | 'CORS_ORIGINS' | 'SESSION_COOKIE_NAME'> & Partial<Pick<Env, 'TRUST_PROXY'>>
  db: DatabaseStatus
  auth: AuthService
  account: AccountService
  profile: ProfileService
  sync: SyncServices
  content: ContentService
  logger: Logger
  rateLimit?: RateLimitOptions
  authRateLimit?: RateLimitOptions
}

/**
 * Builds the Express app without listening, so tests can inject a fake
 * database, in-memory repositories and a silent logger. server.ts does the listening.
 */
export function createApp({ env, db, auth, account, profile, sync, content, logger, rateLimit, authRateLimit }: AppDependencies): Express {
  const app = express()
  app.disable('x-powered-by')
  // TRUST_PROXY = number of reverse proxies in front of the app (0, the default, trusts none). With
  // the right count, req.ip (and so the per-IP rate limits) is the client from X-Forwarded-For.
  if (env.TRUST_PROXY) app.set('trust proxy', env.TRUST_PROXY)

  app.use(requestLogger(logger))
  // gzip/deflate/brotli for responses over 1 kB when the client accepts it (lesson and content lists).
  app.use(compression())
  app.use(helmet())
  // CORS before the rate limiter, so 429 responses are still readable by allowed browser origins.
  app.use(corsMiddleware(env.CORS_ORIGINS))
  app.use(rateLimiter(rateLimit))
  const json = express.json({ limit: JSON_BODY_LIMIT })
  const syncJson = express.json({ limit: SYNC_BODY_LIMIT })
  app.use((req, res, next) => (SYNC_PATHS.test(req.path) ? syncJson : json)(req, res, next))

  app.use(
    '/api',
    createApiRouter({
      db,
      auth,
      account,
      profile,
      sync,
      content,
      cookie: { name: env.SESSION_COOKIE_NAME, secure: env.NODE_ENV === 'production' },
      allowedOrigins: env.CORS_ORIGINS,
      authRateLimit,
    }),
  )

  app.use(notFound)
  app.use(createErrorHandler({ logger, exposeStack: env.NODE_ENV === 'development' }))
  return app
}
