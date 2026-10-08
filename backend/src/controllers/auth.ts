import type { RequestHandler, Response } from 'express'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated } from '../middleware/validate.js'
import { toPublicUser, type AuthService, type NewSession } from '../services/auth.js'
import { clearSessionCookie, readSessionCookie, setSessionCookie, type SessionCookieConfig } from '../utils/sessionCookie.js'
import type { credentialsBody } from '../validators/auth.js'

type Credentials = { body: typeof credentialsBody }

/** The session token goes only into the httpOnly cookie, never into the response body. */
function sendSession(res: Response, cookie: SessionCookieConfig, status: number, session: NewSession): void {
  setSessionCookie(res, cookie, session.token, session.expiresAt)
  res.status(status).json({ user: toPublicUser(session.user) })
}

export function authController(auth: AuthService, cookie: SessionCookieConfig) {
  const register: RequestHandler = async (_req, res) => {
    const { email, password } = getValidated<Credentials>(res).body
    sendSession(res, cookie, 201, await auth.register(email, password))
  }

  const login: RequestHandler = async (_req, res) => {
    const { email, password } = getValidated<Credentials>(res).body
    sendSession(res, cookie, 200, await auth.login(email, password))
  }

  /** Idempotent: ends the session if there is one and always clears the cookie. */
  const logout: RequestHandler = async (req, res) => {
    await auth.logout(readSessionCookie(req, cookie))
    clearSessionCookie(res, cookie)
    res.status(204).end()
  }

  const me: RequestHandler = (_req, res) => {
    res.status(200).json({ user: toPublicUser(getAuth(res).user) })
  }

  return { register, login, logout, me }
}
