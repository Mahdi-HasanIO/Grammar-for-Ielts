import type { Logger } from '../config/logger.js'
import type { AccountTokenType, Repositories, UserRecord } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'
import { generateToken, hashToken, isTokenFormat, type Authenticated } from './auth.js'
import { createMemoryCooldown, type Cooldown } from './cooldown.js'
import type { Mailer } from './mailer.js'
import type { PasswordHasher } from './password.js'

export const PASSWORD_RESET_TTL_MS = 30 * 60 * 1000
export const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000

const TTL: Record<AccountTokenType, number> = {
  password_reset: PASSWORD_RESET_TTL_MS,
  email_verification: EMAIL_VERIFICATION_TTL_MS,
}

/** The frontend pages the email links open. The token is in the fragment, which browsers never send to a server. */
const LINK_PATH: Record<AccountTokenType, string> = {
  password_reset: '/reset-password',
  email_verification: '/verify-email',
}

export interface AccountService {
  /** Sends a verification link. Rejects if the token cannot be stored or the email cannot be sent. */
  sendVerificationEmail(user: UserRecord): Promise<void>
  /** For POST /request-verification: 409 if already verified, 429 within a minute of the last email, 502 if it could not be sent. */
  requestVerification(user: UserRecord): Promise<void>
  verifyEmail(token: string): Promise<void>
  /**
   * Looks the email up and, if there is an account, sends a reset link. Never
   * rejects (failures are logged), so the caller can respond without waiting
   * and the response cannot reveal whether the account exists.
   */
  requestPasswordReset(email: string): Promise<void>
  /** Sets the new password and ends every session of the user. */
  resetPassword(token: string, password: string): Promise<void>
  /** Checks the current password, sets the new one and ends every other session. */
  changePassword(auth: Authenticated, currentPassword: string, newPassword: string): Promise<void>
}

export interface AccountServiceOptions {
  repositories: Repositories
  hasher: PasswordHasher
  mailer: Mailer
  logger: Logger
  /** Frontend origin (and optional base path) for links in emails. */
  appBaseUrl: string
  now?: () => Date
  /** One email of each kind per address per minute. Defaults to an in-memory cooldown. */
  cooldown?: Cooldown
}

const invalidToken = () => new AppError(400, 'invalid_token', 'This link is invalid or has expired')

export function createAccountService({
  repositories: { users, sessions, accountTokens },
  hasher,
  mailer,
  logger,
  appBaseUrl,
  now = () => new Date(),
  cooldown = createMemoryCooldown({ now }),
}: AccountServiceOptions): AccountService {
  /** Creates a token (replacing any older one of this type) and returns the link for the email. */
  async function issueLink(userId: string, type: AccountTokenType): Promise<string> {
    const token = generateToken()
    await accountTokens.replace({ tokenHash: hashToken(token), userId, type, expiresAt: new Date(now().getTime() + TTL[type]) })
    return `${appBaseUrl}${LINK_PATH[type]}#token=${token}`
  }

  /** The user id for a valid, unexpired token of this type. The token is used up either way. */
  async function consume(token: string, type: AccountTokenType): Promise<string> {
    if (!isTokenFormat(token)) throw invalidToken()
    const record = await accountTokens.consume(hashToken(token), type)
    if (!record || record.expiresAt.getTime() <= now().getTime()) throw invalidToken()
    return record.userId
  }

  async function sendVerificationEmail(user: UserRecord): Promise<void> {
    // Register's automatic email counts too, so an immediate "resend" waits for the cooldown.
    cooldown.tryStart(`email_verification:${user.email}`)
    const link = await issueLink(user.id, 'email_verification')
    await mailer.send({
      to: user.email,
      subject: 'Confirm your email for Grammar for IELTS',
      text: `Confirm your email address by opening this link:\n\n${link}\n\nThe link works once and expires in 24 hours. If you did not create an account, you can ignore this email.`,
    })
  }

  return {
    sendVerificationEmail,

    async requestVerification(user) {
      if (user.emailVerifiedAt) throw new AppError(409, 'already_verified', 'This email address is already verified')
      if (!cooldown.tryStart(`email_verification:${user.email}`)) {
        throw new AppError(429, 'email_cooldown', 'An email was sent recently. Please wait a minute before asking again')
      }
      try {
        await sendVerificationEmail(user)
      } catch (error) {
        logger.warn({ err: error }, 'Could not send verification email')
        throw new AppError(502, 'email_failed', 'The email could not be sent. Please try again later', { cause: error })
      }
    },

    async verifyEmail(token) {
      const userId = await consume(token, 'email_verification')
      const user = await users.findById(userId)
      if (!user) throw invalidToken()
      if (!user.emailVerifiedAt) await users.update(userId, { emailVerifiedAt: now() })
    },

    async requestPasswordReset(email) {
      // Checked before the lookup and applied to every address, registered or not, so it reveals nothing.
      // Within the cooldown the request is silently dropped: the caller has already answered 202.
      if (!cooldown.tryStart(`password_reset:${email}`)) return
      try {
        const user = await users.findByEmail(email)
        if (!user) return
        const link = await issueLink(user.id, 'password_reset')
        await mailer.send({
          to: user.email,
          subject: 'Reset your Grammar for IELTS password',
          text: `Choose a new password by opening this link:\n\n${link}\n\nThe link works once and expires in 30 minutes. If you did not ask to reset your password, you can ignore this email; your password has not changed.`,
        })
      } catch (error) {
        logger.warn({ err: error }, 'Could not send password reset email')
      }
    },

    async resetPassword(token, password) {
      const userId = await consume(token, 'password_reset')
      const passwordHash = await hasher.hash(password)
      if (!(await users.update(userId, { passwordHash }))) throw invalidToken()
      // Whoever had the old password (possibly an attacker) is signed out everywhere.
      await sessions.deleteAllForUser(userId)
    },

    async changePassword({ user, tokenHash }, currentPassword, newPassword) {
      if (!(await hasher.verify(user.passwordHash, currentPassword))) {
        throw new AppError(400, 'invalid_current_password', 'The current password is not correct')
      }
      await users.update(user.id, { passwordHash: await hasher.hash(newPassword) })
      await sessions.deleteAllForUser(user.id, tokenHash)
      // A reset link sent before the change must not be able to undo it.
      await accountTokens.deleteForUser(user.id, 'password_reset')
    },
  }
}
