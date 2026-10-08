import type { RequestHandler, Response } from 'express'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated } from '../middleware/validate.js'
import type { AccountService } from '../services/account.js'
import { toPublicUser, type AuthService, type NewSession } from '../services/auth.js'
import { clearSessionCookie, readSessionCookie, setSessionCookie, type SessionCookieConfig } from '../utils/sessionCookie.js'
import type { changePasswordBody, credentialsBody, forgotPasswordBody, resetPasswordBody, verifyEmailBody } from '../validators/auth.js'

type Credentials = { body: typeof credentialsBody }

/** The same body whether or not the account exists, so the response does not reveal registered emails. */
export const FORGOT_PASSWORD_RESPONSE = { message: 'If an account exists for this email, a password reset link has been sent.' }
export const VERIFICATION_SENT_RESPONSE = { message: 'A verification link has been sent.' }

/** The session token goes only into the httpOnly cookie, never into the response body. */
function sendSession(res: Response, cookie: SessionCookieConfig, status: number, session: NewSession): void {
  setSessionCookie(res, cookie, session.token, session.expiresAt)
  res.status(status).json({ user: toPublicUser(session.user) })
}

export function authController(auth: AuthService, account: AccountService, cookie: SessionCookieConfig) {
  const register: RequestHandler = async (req, res) => {
    const { email, password } = getValidated<Credentials>(res).body
    const session = await auth.register(email, password)
    // Sent in the background: a slow or failing mail provider must not delay or fail registration.
    // A failure is logged, and the user can ask for a new link (POST /request-verification).
    void account.sendVerificationEmail(session.user).catch((error: unknown) => {
      req.log.warn({ err: error }, 'Could not send verification email after registration')
    })
    sendSession(res, cookie, 201, session)
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

  /**
   * Answers 202 straight away and does the lookup and sending afterwards, so
   * neither the body nor the response time depends on whether the email has
   * an account.
   */
  const forgotPassword: RequestHandler = (_req, res) => {
    const { email } = getValidated<{ body: typeof forgotPasswordBody }>(res).body
    void account.requestPasswordReset(email)
    res.status(202).json(FORGOT_PASSWORD_RESPONSE)
  }

  const resetPassword: RequestHandler = async (_req, res) => {
    const { token, password } = getValidated<{ body: typeof resetPasswordBody }>(res).body
    await account.resetPassword(token, password)
    // Every session of the account ended, including this browser's if it had one.
    clearSessionCookie(res, cookie)
    res.status(204).end()
  }

  const requestVerification: RequestHandler = async (_req, res) => {
    await account.requestVerification(getAuth(res).user)
    res.status(202).json(VERIFICATION_SENT_RESPONSE)
  }

  const verifyEmail: RequestHandler = async (_req, res) => {
    const { token } = getValidated<{ body: typeof verifyEmailBody }>(res).body
    await account.verifyEmail(token)
    res.status(204).end()
  }

  const changePassword: RequestHandler = async (_req, res) => {
    const { currentPassword, newPassword } = getValidated<{ body: typeof changePasswordBody }>(res).body
    await account.changePassword(getAuth(res), currentPassword, newPassword)
    res.status(204).end()
  }

  return { register, login, logout, me, forgotPassword, resetPassword, requestVerification, verifyEmail, changePassword }
}
