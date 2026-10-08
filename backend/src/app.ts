import express, { type Express } from 'express'
import helmet from 'helmet'
import type { Env } from './config/env.js'
import type { Logger } from './config/logger.js'
import { corsMiddleware } from './middleware/cors.js'
import { createErrorHandler, notFound } from './middleware/errorHandler.js'
import { rateLimiter, type RateLimitOptions } from './middleware/rateLimit.js'
import { requestLogger } from './middleware/requestLogger.js'
import { createApiRouter } from './routes/index.js'
import type { AuthService } from './services/auth.js'
import type { DatabaseStatus } from './services/database.js'

/** JSON request bodies above this size get 413. Generous for API payloads, small enough to limit abuse. */
export const JSON_BODY_LIMIT = '100kb'

export interface AppDependencies {
  env: Pick<Env, 'NODE_ENV' | 'CORS_ORIGINS' | 'SESSION_COOKIE_NAME'>
  db: DatabaseStatus
  auth: AuthService
  logger: Logger
  rateLimit?: RateLimitOptions
  authRateLimit?: RateLimitOptions
}

/**
 * Builds the Express app without listening, so tests can inject a fake
 * database, in-memory repositories and a silent logger. server.ts does the listening.
 */
export function createApp({ env, db, auth, logger, rateLimit, authRateLimit }: AppDependencies): Express {
  const app = express()
  app.disable('x-powered-by')
  // `trust proxy` stays off until the hosting provider is known: set it to the
  // number of proxies in front of the app so req.ip (and the rate limiter) use
  // the real client IP from X-Forwarded-For.

  app.use(requestLogger(logger))
  app.use(helmet())
  // CORS before the rate limiter, so 429 responses are still readable by allowed browser origins.
  app.use(corsMiddleware(env.CORS_ORIGINS))
  app.use(rateLimiter(rateLimit))
  app.use(express.json({ limit: JSON_BODY_LIMIT }))

  app.use(
    '/api',
    createApiRouter({
      db,
      auth: {
        auth,
        cookie: { name: env.SESSION_COOKIE_NAME, secure: env.NODE_ENV === 'production' },
        allowedOrigins: env.CORS_ORIGINS,
        rateLimit: authRateLimit,
      },
    }),
  )

  app.use(notFound)
  app.use(createErrorHandler({ logger, exposeStack: env.NODE_ENV === 'development' }))
  return app
}
