import { Router } from 'express'
import { authController } from '../controllers/auth.js'
import { csrfProtection } from '../middleware/csrf.js'
import { authRateLimiter, type RateLimitOptions } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireDatabase } from '../middleware/requireDatabase.js'
import { validate } from '../middleware/validate.js'
import type { AuthService } from '../services/auth.js'
import type { DatabaseStatus } from '../services/database.js'
import type { SessionCookieConfig } from '../utils/sessionCookie.js'
import { credentialsBody } from '../validators/auth.js'

export interface AuthRouterOptions {
  auth: AuthService
  db: DatabaseStatus
  cookie: SessionCookieConfig
  allowedOrigins: readonly string[]
  rateLimit?: RateLimitOptions
}

/**
 * /api/auth: register, login, logout, me. Every route counts against the stricter auth rate limit,
 * and returns 503 while MongoDB is unreachable.
 */
export function createAuthRouter({ auth, db, cookie, allowedOrigins, rateLimit }: AuthRouterOptions): Router {
  const router = Router()
  const controller = authController(auth, cookie)
  const csrf = csrfProtection(allowedOrigins)

  router.use(authRateLimiter(rateLimit))
  router.use(requireDatabase(db))
  router.post('/register', csrf, validate({ body: credentialsBody }), controller.register)
  router.post('/login', csrf, validate({ body: credentialsBody }), controller.login)
  router.post('/logout', csrf, controller.logout)
  router.get('/me', requireAuth(auth, cookie), controller.me)
  return router
}
