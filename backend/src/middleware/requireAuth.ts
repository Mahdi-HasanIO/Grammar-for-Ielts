import type { RequestHandler, Response } from 'express'
import type { Authenticated, AuthService } from '../services/auth.js'
import { AppError } from '../utils/AppError.js'
import { clearSessionCookie, readSessionCookie, type SessionCookieConfig } from '../utils/sessionCookie.js'

/**
 * Lets the request through only with a valid, unexpired session cookie, and
 * stores the user for the handler (read it with getAuth()). Otherwise 401;
 * a cookie that did not match a session is cleared.
 */
export function requireAuth(auth: AuthService, cookie: SessionCookieConfig): RequestHandler {
  return async (req, res, next) => {
    const token = readSessionCookie(req, cookie)
    const result = await auth.authenticate(token)
    if (!result) {
      if (token !== undefined) clearSessionCookie(res, cookie)
      throw new AppError(401, 'unauthenticated', 'Authentication required')
    }
    res.locals.auth = result
    next()
  }
}

/** The session and user attached by requireAuth. Only call from routes behind requireAuth. */
export function getAuth(res: Response): Authenticated {
  const auth = res.locals.auth as Authenticated | undefined
  if (!auth) throw new Error('getAuth() called on a route without requireAuth')
  return auth
}
