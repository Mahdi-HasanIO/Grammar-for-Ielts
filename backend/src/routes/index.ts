import { Router } from 'express'
import { liveness, readiness } from '../controllers/health.js'
import { csrfProtection } from '../middleware/csrf.js'
import { authRateLimiter, type RateLimitOptions } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireDatabase } from '../middleware/requireDatabase.js'
import type { AccountService } from '../services/account.js'
import type { AuthService } from '../services/auth.js'
import type { DatabaseStatus } from '../services/database.js'
import type { ProfileService } from '../services/profile.js'
import type { SessionCookieConfig } from '../utils/sessionCookie.js'
import { createAuthRouter, type AccountRouteGuards } from './auth.js'
import { createProfileRouter } from './profile.js'

export interface ApiRouterOptions {
  db: DatabaseStatus
  auth: AuthService
  account: AccountService
  profile: ProfileService
  cookie: SessionCookieConfig
  allowedOrigins: readonly string[]
  authRateLimit?: RateLimitOptions
}

/** Everything under /api. Feature routers are added here as later phases introduce them. */
export function createApiRouter({ db, auth, account, profile, cookie, allowedOrigins, authRateLimit }: ApiRouterOptions): Router {
  const guards: AccountRouteGuards = {
    limiter: authRateLimiter(authRateLimit),
    database: requireDatabase(db),
    csrf: csrfProtection(allowedOrigins),
    signedIn: requireAuth(auth, cookie),
  }

  const router = Router()
  router.get('/health', liveness)
  router.get('/health/ready', readiness(db))
  router.use('/auth', createAuthRouter({ auth, account, cookie, guards }))
  router.use('/profile', createProfileRouter({ profile, guards }))
  return router
}
