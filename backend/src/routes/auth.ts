import { Router } from 'express'
import { authController } from '../controllers/auth.js'
import { csrfProtection } from '../middleware/csrf.js'
import { authRateLimiter, type RateLimitOptions } from '../middleware/rateLimit.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'
import type { AuthService } from '../services/auth.js'
import type { SessionCookieConfig } from '../utils/sessionCookie.js'
import { credentialsBody } from '../validators/auth.js'

export interface AuthRouterOptions {
  auth: AuthService
  cookie: SessionCookieConfig
  allowedOrigins: readonly string[]
  rateLimit?: RateLimitOptions
}

/** /api/auth: register, login, logout, me. Every route counts against the stricter auth rate limit. */
export function createAuthRouter({ auth, cookie, allowedOrigins, rateLimit }: AuthRouterOptions): Router {
  const router = Router()
  const controller = authController(auth, cookie)
  const csrf = csrfProtection(allowedOrigins)

  router.use(authRateLimiter(rateLimit))
  router.post('/register', csrf, validate({ body: credentialsBody }), controller.register)
  router.post('/login', csrf, validate({ body: credentialsBody }), controller.login)
  router.post('/logout', csrf, controller.logout)
  router.get('/me', requireAuth(auth, cookie), controller.me)
  return router
}
