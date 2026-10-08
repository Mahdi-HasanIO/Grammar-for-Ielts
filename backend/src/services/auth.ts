import { createHash, randomBytes } from 'node:crypto'
import { DuplicateEmailError, type Repositories, type UserRecord } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'
import { dummyHash, type PasswordHasher } from './password.js'

export const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000
const TOKEN_BYTES = 32
/** 32 bytes as base64url: 43 characters. Anything else is rejected before touching the database. */
const TOKEN_FORMAT = /^[A-Za-z0-9_-]{43}$/

/** A new random token (session or one-time link): 32 bytes, base64url. */
export const generateToken = () => randomBytes(TOKEN_BYTES).toString('base64url')

/** True if the value could be a token from generateToken(); cheap check before hashing and querying. */
export const isTokenFormat = (value: string | undefined): value is string => value !== undefined && TOKEN_FORMAT.test(value)

/** What the API returns for a user. Never includes the password hash. */
export interface PublicUser {
  id: string
  email: string
  emailVerifiedAt: string | null
  createdAt: string
}

export const toPublicUser = (user: UserRecord): PublicUser => ({
  id: user.id,
  email: user.email,
  emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
  createdAt: user.createdAt.toISOString(),
})

export interface NewSession {
  user: UserRecord
  /** The raw token, for the cookie only. The database stores its SHA-256. */
  token: string
  expiresAt: Date
}

export interface Authenticated {
  user: UserRecord
  tokenHash: string
}

export interface AuthService {
  register(email: string, password: string): Promise<NewSession>
  login(email: string, password: string): Promise<NewSession>
  logout(token: string | undefined): Promise<void>
  /** The user for a session token, or null if the token is missing, malformed, unknown or expired. */
  authenticate(token: string | undefined): Promise<Authenticated | null>
}

export interface AuthServiceOptions {
  repositories: Repositories
  hasher: PasswordHasher
  now?: () => Date
  sessionTtlMs?: number
}

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

/** One message for unknown email and wrong password, so the response does not reveal which it was. */
const invalidCredentials = () => new AppError(401, 'invalid_credentials', 'Invalid email or password')

export function createAuthService({
  repositories: { users, sessions },
  hasher,
  now = () => new Date(),
  sessionTtlMs = SESSION_TTL_MS,
}: AuthServiceOptions): AuthService {
  const getDummyHash = dummyHash(hasher)

  async function startSession(user: UserRecord): Promise<NewSession> {
    const token = generateToken()
    const expiresAt = new Date(now().getTime() + sessionTtlMs)
    await sessions.create({ tokenHash: hashToken(token), userId: user.id, expiresAt })
    return { user, token, expiresAt }
  }

  return {
    async register(email, password) {
      // Registering an existing email returns 409, which does reveal that the email has an account.
      // Accepted for now: the alternative (always "check your inbox") needs email verification,
      // which is Phase 1B-2. Revisit then; the auth rate limit slows bulk probing meanwhile.
      if (await users.findByEmail(email)) throw new AppError(409, 'email_taken', 'An account with this email already exists')
      const passwordHash = await hasher.hash(password)
      try {
        return await startSession(await users.create({ email, passwordHash }))
      } catch (error) {
        // Two registrations racing past the check above: the unique index decides.
        if (error instanceof DuplicateEmailError) throw new AppError(409, 'email_taken', 'An account with this email already exists')
        throw error
      }
    },

    async login(email, password) {
      const user = await users.findByEmail(email)
      if (!user) {
        // Same work as a real check, so timing does not reveal whether the email is registered.
        await hasher.verify(await getDummyHash(), password)
        throw invalidCredentials()
      }
      if (!(await hasher.verify(user.passwordHash, password))) throw invalidCredentials()
      return startSession(user)
    },

    async logout(token) {
      if (isTokenFormat(token)) await sessions.deleteByTokenHash(hashToken(token))
    },

    async authenticate(token) {
      if (!isTokenFormat(token)) return null
      const tokenHash = hashToken(token)
      const session = await sessions.findByTokenHash(tokenHash)
      if (!session) return null
      if (session.expiresAt.getTime() <= now().getTime()) {
        await sessions.deleteByTokenHash(tokenHash)
        return null
      }
      const user = await users.findById(session.userId)
      if (!user) {
        await sessions.deleteByTokenHash(tokenHash)
        return null
      }
      return { user, tokenHash }
    },
  }
}
