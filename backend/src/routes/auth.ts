import { Router, type RequestHandler } from 'express'
import { authController } from '../controllers/auth.js'
import { validate } from '../middleware/validate.js'
import type { AccountService } from '../services/account.js'
import type { AuthService } from '../services/auth.js'
import type { SessionCookieConfig } from '../utils/sessionCookie.js'
import { changePasswordBody, credentialsBody, forgotPasswordBody, resetPasswordBody, verifyEmailBody } from '../validators/auth.js'

/** Middleware shared with the profile router (see routes/index.ts). */
export interface AccountRouteGuards {
  /** The stricter auth rate limiter: one counter across /api/auth and /api/profile. */
  limiter: RequestHandler
  /** 503 while MongoDB is unreachable. */
  database: RequestHandler
  /** JSON-only and Origin allowlist, for state-changing routes. */
  csrf: RequestHandler
  /** 401 without a valid session; attaches the user. */
  signedIn: RequestHandler
}

export interface AuthRouterOptions {
  auth: AuthService
  account: AccountService
  cookie: SessionCookieConfig
  guards: AccountRouteGuards
}

/**
 * /api/auth. Every route counts against the auth rate limit and returns 503
 * while MongoDB is unreachable; every POST requires JSON from an allowed origin.
 */
export function createAuthRouter({ auth, account, cookie, guards: { limiter, database, csrf, signedIn } }: AuthRouterOptions): Router {
  const router = Router()
  const controller = authController(auth, account, cookie)

  router.use(limiter, database)
  router.post('/register', csrf, validate({ body: credentialsBody }), controller.register)
  router.post('/login', csrf, validate({ body: credentialsBody }), controller.login)
  router.post('/logout', csrf, controller.logout)
  router.get('/me', signedIn, controller.me)

  router.post('/forgot-password', csrf, validate({ body: forgotPasswordBody }), controller.forgotPassword)
  router.post('/reset-password', csrf, validate({ body: resetPasswordBody }), controller.resetPassword)
  router.post('/request-verification', csrf, signedIn, controller.requestVerification)
  router.post('/verify-email', csrf, validate({ body: verifyEmailBody }), controller.verifyEmail)
  router.post('/change-password', csrf, signedIn, validate({ body: changePasswordBody }), controller.changePassword)
  return router
}
