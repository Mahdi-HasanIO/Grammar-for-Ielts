import { createHash } from 'node:crypto'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { FORGOT_PASSWORD_RESPONSE, VERIFICATION_SENT_RESPONSE } from '../src/controllers/auth.js'
import { EMAIL_VERIFICATION_TTL_MS, PASSWORD_RESET_TTL_MS } from '../src/services/account.js'
import { EMAIL_COOLDOWN_MS } from '../src/services/cooldown.js'
import { createLogMailer, type Mailer } from '../src/services/mailer.js'
import {
  ALLOWED_ORIGIN,
  APP_BASE_URL,
  capturingLogger,
  recordingMailer,
  silentLogger,
  TEST_ENV,
  testApp,
  testServices,
  mailToken,
  type TestServiceOptions,
} from './helpers.js'
import { EMAIL, get, isSignedIn, NEW_PASSWORD, PASSWORD, post, sessionToken, setCookie, signIn, signUp } from './http.js'

const INVALID_TOKEN = { error: { code: 'invalid_token', message: 'This link is invalid or has expired', requestId: expect.any(String) } }
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

/** An app plus its services, recorded emails and a controllable clock. */
function setup(options: TestServiceOptions & { production?: boolean } = {}) {
  let now = new Date('2026-03-01T09:00:00Z')
  const mailer = options.mailer ?? recordingMailer()
  const logger = options.logger ?? silentLogger()
  const services = testServices({ now: () => now, ...options, mailer, logger })
  const { auth, account, profile } = services
  const env = options.production ? { ...TEST_ENV, NODE_ENV: 'production' as const } : TEST_ENV
  const app = testApp({ auth, account, profile, logger, env })
  return {
    app,
    ...services,
    advance: (ms: number) => {
      now = new Date(now.getTime() + ms)
    },
  }
}

/** forgot-password answers before the email is sent; wait for it. */
async function waitForMail(sent: readonly unknown[], count: number) {
  await vi.waitFor(() => expect(sent.length).toBeGreaterThanOrEqual(count))
}

describe('email verification', () => {
  it('register sends a verification link to the new address', async () => {
    const { app, sent } = setup()
    await signUp(app)
    await waitForMail(sent, 1)
    expect(sent).toHaveLength(1)
    expect(sent[0]?.to).toBe(EMAIL)
    expect(sent[0]?.text).toMatch(new RegExp(`${APP_BASE_URL}/verify-email#token=[A-Za-z0-9_-]{43}`))
  })

  it('register still succeeds, and logs a warning, when the email cannot be sent', async () => {
    const { logger, lines } = capturingLogger()
    const failing: Mailer = { send: async () => Promise.reject(new Error('SMTP down')) }
    const { app } = setup({ mailer: failing, logger })
    const res = await post(app, '/api/auth/register', { email: EMAIL, password: PASSWORD })
    expect(res.status).toBe(201)
    await vi.waitFor(() => {
      const warning = lines.map((l) => JSON.parse(l)).find((e) => e.msg === 'Could not send verification email after registration')
      expect(warning).toMatchObject({ level: 40, err: { message: 'SMTP down' } })
    })
  })

  it('verify-email marks the address verified, visible in /me', async () => {
    const { app, sent } = setup()
    const session = await signUp(app)
    const res = await post(app, '/api/auth/verify-email', { token: await mailToken(sent, '/verify-email') })
    expect(res.status).toBe(204)
    const me = await get(app, '/api/auth/me', session)
    expect(me.body.user.emailVerifiedAt).toBe('2026-03-01T09:00:00.000Z')
  })

  it('a verification link works once', async () => {
    const { app, sent } = setup()
    await signUp(app)
    const token = await mailToken(sent, '/verify-email')
    expect((await post(app, '/api/auth/verify-email', { token })).status).toBe(204)
    const again = await post(app, '/api/auth/verify-email', { token })
    expect(again.status).toBe(400)
    expect(again.body).toEqual(INVALID_TOKEN)
  })

  it('a verification link expires after 24 hours', async () => {
    const { app, sent, advance } = setup()
    await signUp(app)
    advance(EMAIL_VERIFICATION_TTL_MS)
    const res = await post(app, '/api/auth/verify-email', { token: await mailToken(sent, '/verify-email') })
    expect(res.body).toEqual(INVALID_TOKEN)
  })

  it('a new request invalidates the previous link', async () => {
    const { app, sent, advance } = setup()
    const session = await signUp(app)
    const first = await mailToken(sent, '/verify-email')
    advance(EMAIL_COOLDOWN_MS)
    const res = await post(app, '/api/auth/request-verification', {}, session)
    expect(res.status).toBe(202)
    expect(res.body).toEqual(VERIFICATION_SENT_RESPONSE)
    const second = await mailToken(sent, '/verify-email')
    expect(second).not.toBe(first)
    expect((await post(app, '/api/auth/verify-email', { token: first })).body).toEqual(INVALID_TOKEN)
    expect((await post(app, '/api/auth/verify-email', { token: second })).status).toBe(204)
  })

  it.each([
    ['one character changed', (t: string) => (t[0] === 'A' ? 'B' : 'A') + t.slice(1)],
    ['truncated', (t: string) => t.slice(0, -1)],
    ['garbage', () => 'not-a-token'],
  ])('rejects a tampered token (%s)', async (_name, tamper) => {
    const { app, sent } = setup()
    await signUp(app)
    const token = await mailToken(sent, '/verify-email')
    expect((await post(app, '/api/auth/verify-email', { token: tamper(token) })).body).toEqual(INVALID_TOKEN)
    expect((await post(app, '/api/auth/verify-email', { token })).status).toBe(204)
  })

  it('validates the body', async () => {
    const { app } = setup()
    for (const body of [{}, { token: '' }, { token: 42 }, { token: 'x'.repeat(201) }]) {
      const res = await post(app, '/api/auth/verify-email', body)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('validation_error')
    }
  })

  it('request-verification needs a session', async () => {
    const { app } = setup()
    expect((await post(app, '/api/auth/request-verification')).status).toBe(401)
  })

  it('request-verification is 409 once verified', async () => {
    const { app, sent } = setup()
    const session = await signUp(app)
    await post(app, '/api/auth/verify-email', { token: await mailToken(sent, '/verify-email') })
    const res = await post(app, '/api/auth/request-verification', {}, session)
    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('already_verified')
  })

  it('request-verification is 502 when the email cannot be sent', async () => {
    let fail = false
    const mailer: Mailer = { send: async () => (fail ? Promise.reject(new Error('provider down')) : undefined) }
    const { app, advance } = setup({ mailer })
    const session = await signUp(app)
    fail = true
    advance(EMAIL_COOLDOWN_MS)
    const res = await post(app, '/api/auth/request-verification', {}, session)
    expect(res.status).toBe(502)
    expect(res.body).toEqual({ error: { code: 'email_failed', message: 'The email could not be sent. Please try again later', requestId: expect.any(String) } })
  })

  it('a password reset token cannot verify an email', async () => {
    const { app, sent } = setup()
    await signUp(app)
    await post(app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(sent, 2)
    expect((await post(app, '/api/auth/verify-email', { token: await mailToken(sent, '/reset-password') })).body).toEqual(INVALID_TOKEN)
  })
})

describe('forgot-password', () => {
  it('answers the same status and body whether or not the email has an account', async () => {
    const { app, sent } = setup()
    await signUp(app)
    const known = await post(app, '/api/auth/forgot-password', { email: EMAIL })
    const unknown = await post(app, '/api/auth/forgot-password', { email: 'nobody@example.com' })
    for (const res of [known, unknown]) {
      expect(res.status).toBe(202)
      expect(res.body).toEqual(FORGOT_PASSWORD_RESPONSE)
      expect(setCookie(res)).toBeUndefined()
    }
    await waitForMail(sent, 2)
    // Only the registration email and one reset email: nothing for the unknown address.
    expect(sent.map((m) => m.to)).toEqual([EMAIL, EMAIL])
    expect(sent[1]?.text).toMatch(new RegExp(`${APP_BASE_URL}/reset-password#token=[A-Za-z0-9_-]{43}`))
  })

  it('register does not wait for the verification email either', async () => {
    const neverSends: Mailer = { send: () => new Promise(() => {}) }
    const { app } = setup({ mailer: neverSends })
    expect((await post(app, '/api/auth/register', { email: EMAIL, password: PASSWORD })).status).toBe(201)
  })

  it('responds without waiting for the lookup or the email, so timing does not reveal accounts', async () => {
    const neverSends: Mailer = { send: () => new Promise(() => {}) }
    const { app } = setup({ mailer: neverSends })
    await signUp(app)
    const res = await post(app, '/api/auth/forgot-password', { email: EMAIL })
    expect(res.status).toBe(202)
  })

  it('still answers 202 when sending fails (the failure is logged)', async () => {
    const { logger, lines } = capturingLogger()
    let fail = false
    const mailer: Mailer = { send: async () => (fail ? Promise.reject(new Error('provider down')) : undefined) }
    const { app } = setup({ mailer, logger })
    await signUp(app)
    fail = true
    expect((await post(app, '/api/auth/forgot-password', { email: EMAIL })).status).toBe(202)
    await vi.waitFor(() => expect(lines.join('\n')).toContain('Could not send password reset email'))
  })

  it('normalises the email', async () => {
    const { app, sent } = setup()
    await signUp(app)
    await post(app, '/api/auth/forgot-password', { email: '  LEARNER@example.COM ' })
    await waitForMail(sent, 2)
    expect(sent[1]?.to).toBe(EMAIL)
  })

  it('validates the email', async () => {
    const { app } = setup()
    for (const body of [{}, { email: 'not-an-email' }]) {
      const res = await post(app, '/api/auth/forgot-password', body)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('validation_error')
    }
  })
})

describe('reset-password', () => {
  async function requestReset(ctx: ReturnType<typeof setup>) {
    const before = ctx.sent.length
    await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(ctx.sent, before + 1)
    return await mailToken(ctx.sent, '/reset-password')
  }

  it('sets the new password, ends every session and clears the cookie', async () => {
    const ctx = setup()
    const first = await signUp(ctx.app)
    const second = await signIn(ctx.app)
    const token = await requestReset(ctx)

    const res = await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD }, first)
    expect(res.status).toBe(204)
    expect(setCookie(res)).toMatch(/Expires=Thu, 01 Jan 1970/)

    expect(await isSignedIn(ctx.app, first)).toBe(false)
    expect(await isSignedIn(ctx.app, second)).toBe(false)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: PASSWORD })).status).toBe(401)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: NEW_PASSWORD })).status).toBe(200)

    const user = await ctx.repositories.users.findByEmail(EMAIL)
    expect(user?.passwordHash).toMatch(/^\$argon2id\$/)
  })

  it('a reset link works once', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD })).status).toBe(204)
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: 'yet another password' })).body).toEqual(INVALID_TOKEN)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: NEW_PASSWORD })).status).toBe(200)
  })

  it('a reset link expires after 30 minutes', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    ctx.advance(PASSWORD_RESET_TTL_MS)
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD })).body).toEqual(INVALID_TOKEN)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: PASSWORD })).status).toBe(200)
  })

  it('works up to the expiry moment', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    ctx.advance(PASSWORD_RESET_TTL_MS - 1)
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD })).status).toBe(204)
  })

  it('a new request invalidates the previous link', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const first = await requestReset(ctx)
    ctx.advance(EMAIL_COOLDOWN_MS)
    const second = await requestReset(ctx)
    expect((await post(ctx.app, '/api/auth/reset-password', { token: first, password: NEW_PASSWORD })).body).toEqual(INVALID_TOKEN)
    expect((await post(ctx.app, '/api/auth/reset-password', { token: second, password: NEW_PASSWORD })).status).toBe(204)
  })

  it('rejects a tampered token and leaves the password unchanged', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    const tampered = (token[0] === 'A' ? 'B' : 'A') + token.slice(1)
    expect((await post(ctx.app, '/api/auth/reset-password', { token: tampered, password: NEW_PASSWORD })).body).toEqual(INVALID_TOKEN)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: PASSWORD })).status).toBe(200)
  })

  it('a verification token cannot reset a password', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await mailToken(ctx.sent, '/verify-email')
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD })).body).toEqual(INVALID_TOKEN)
  })

  it('validates the new password before using up the token', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    for (const password of ['short', 'x'.repeat(129)]) {
      const res = await post(ctx.app, '/api/auth/reset-password', { token, password })
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('validation_error')
    }
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: NEW_PASSWORD })).status).toBe(204)
  })

  it('stores only the SHA-256 of the token', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    const token = await requestReset(ctx)
    expect(await ctx.repositories.accountTokens.consume(token, 'password_reset')).toBeNull()
    expect(await ctx.repositories.accountTokens.consume(sha256(token), 'password_reset')).not.toBeNull()
  })
})

describe('change-password', () => {
  it('needs a session', async () => {
    const { app } = setup()
    expect((await post(app, '/api/auth/change-password', { currentPassword: PASSWORD, newPassword: NEW_PASSWORD })).status).toBe(401)
  })

  it('rotates the hash, keeps this session and ends the others', async () => {
    const ctx = setup()
    const current = await signUp(ctx.app)
    const other = await signIn(ctx.app)
    const before = (await ctx.repositories.users.findByEmail(EMAIL))?.passwordHash

    const res = await post(ctx.app, '/api/auth/change-password', { currentPassword: PASSWORD, newPassword: NEW_PASSWORD }, current)
    expect(res.status).toBe(204)
    expect(setCookie(res)).toBeUndefined()

    expect(await isSignedIn(ctx.app, current)).toBe(true)
    expect(await isSignedIn(ctx.app, other)).toBe(false)
    const after = (await ctx.repositories.users.findByEmail(EMAIL))?.passwordHash
    expect(after).toMatch(/^\$argon2id\$/)
    expect(after).not.toBe(before)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: PASSWORD })).status).toBe(401)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: NEW_PASSWORD })).status).toBe(200)
  })

  it('rejects a wrong current password and changes nothing', async () => {
    const ctx = setup()
    const current = await signUp(ctx.app)
    const other = await signIn(ctx.app)
    const res = await post(ctx.app, '/api/auth/change-password', { currentPassword: 'not my password', newPassword: NEW_PASSWORD }, current)
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: { code: 'invalid_current_password', message: 'The current password is not correct', requestId: expect.any(String) } })
    expect(await isSignedIn(ctx.app, other)).toBe(true)
    expect((await post(ctx.app, '/api/auth/login', { email: EMAIL, password: PASSWORD })).status).toBe(200)
  })

  it('invalidates a reset link sent before the change', async () => {
    const ctx = setup()
    const current = await signUp(ctx.app)
    await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(ctx.sent, 2)
    const token = await mailToken(ctx.sent, '/reset-password')
    await post(ctx.app, '/api/auth/change-password', { currentPassword: PASSWORD, newPassword: NEW_PASSWORD }, current)
    expect((await post(ctx.app, '/api/auth/reset-password', { token, password: 'attacker password!' })).body).toEqual(INVALID_TOKEN)
  })

  it('validates the body', async () => {
    const ctx = setup()
    const current = await signUp(ctx.app)
    for (const body of [{}, { currentPassword: PASSWORD }, { currentPassword: PASSWORD, newPassword: 'short' }, { currentPassword: '', newPassword: NEW_PASSWORD }]) {
      const res = await post(ctx.app, '/api/auth/change-password', body, current)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('validation_error')
    }
  })
})

describe('no secrets in responses or production logs', () => {
  it('responses never contain tokens, hashes or passwords', async () => {
    const ctx = setup()
    const register = await post(ctx.app, '/api/auth/register', { email: EMAIL, password: PASSWORD })
    const session = sessionToken(register)
    const verifyToken = await mailToken(ctx.sent, '/verify-email')
    const forgot = await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(ctx.sent, 2)
    const resetToken = await mailToken(ctx.sent, '/reset-password')
    const responses = [
      register,
      forgot,
      await post(ctx.app, '/api/auth/request-verification', {}, session),
      await post(ctx.app, '/api/auth/verify-email', { token: await mailToken(ctx.sent, '/verify-email') }),
      await post(ctx.app, '/api/auth/reset-password', { token: resetToken, password: NEW_PASSWORD }),
      await post(ctx.app, '/api/auth/change-password', { currentPassword: NEW_PASSWORD, newPassword: PASSWORD }, await signIn(ctx.app, EMAIL, NEW_PASSWORD)),
    ]
    for (const res of responses) {
      expect(res.text).not.toMatch(/\$argon2|passwordHash|tokenHash/)
      for (const secret of [PASSWORD, NEW_PASSWORD, verifyToken, resetToken, sha256(resetToken)]) expect(res.text).not.toContain(secret)
    }
  })

  it('in production the log transport and request logs show no token, link, hash or password', async () => {
    const { logger, lines } = capturingLogger()
    const mailer = createLogMailer({ logger, includeContent: false })
    const recorder = recordingMailer()
    const both: Mailer = { send: async (m) => (await mailer.send(m), recorder.send(m)) }
    const { app } = setup({ mailer: both, logger, production: true })

    const session = await signUp(app)
    await post(app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(recorder.sent, 2)
    const resetToken = await mailToken(recorder.sent, '/reset-password')
    await post(app, '/api/auth/reset-password', { token: resetToken, password: NEW_PASSWORD })
    await post(app, '/api/auth/change-password', { currentPassword: NEW_PASSWORD, newPassword: PASSWORD }, await signIn(app, EMAIL, NEW_PASSWORD))

    const all = lines.join('\n')
    expect(lines.some((l) => l.includes('content omitted in production'))).toBe(true)
    for (const secret of [PASSWORD, NEW_PASSWORD, session, resetToken, await mailToken(recorder.sent, '/verify-email'), '#token=', '$argon2', EMAIL]) {
      expect(all).not.toContain(secret)
    }
  })
})

describe('Origin, content type and rate limit on the new routes', () => {
  const routes = ['/api/auth/forgot-password', '/api/auth/reset-password', '/api/auth/verify-email', '/api/auth/request-verification', '/api/auth/change-password']

  it.each(routes)('%s rejects a disallowed Origin with 403', async (path) => {
    const { app } = setup()
    const res = await post(app, path, { email: EMAIL }).set('Origin', 'https://evil.example.com')
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('origin_not_allowed')
  })

  it.each(routes)('%s rejects a non-JSON body with 415', async (path) => {
    const { app } = setup()
    const res = await request(app).post(path).set('Content-Type', 'text/plain').send('{}')
    expect(res.status).toBe(415)
  })

  it('accepts an allowlisted Origin', async () => {
    const { app } = setup()
    expect((await post(app, '/api/auth/forgot-password', { email: EMAIL }).set('Origin', ALLOWED_ORIGIN)).status).toBe(202)
  })

  it('counts the new routes and /api/profile against the shared auth limit', async () => {
    const services = testServices()
    const app = testApp({ ...services, authRateLimit: { windowMs: 60_000, limit: 3 } })
    expect((await post(app, '/api/auth/forgot-password', { email: EMAIL })).status).toBe(202)
    expect((await get(app, '/api/profile')).status).toBe(401)
    expect((await post(app, '/api/auth/verify-email', { token: 'x' })).status).toBe(400)
    for (const res of [await post(app, '/api/auth/reset-password', { token: 'x', password: NEW_PASSWORD }), await get(app, '/api/profile')]) {
      expect(res.status).toBe(429)
      expect(res.body.error.code).toBe('rate_limited')
    }
  })

  it('returns 503 on the new routes while MongoDB is unreachable', async () => {
    const services = testServices()
    const app = testApp({ ...services, db: { state: () => 'disconnected' } })
    for (const res of [await post(app, '/api/auth/forgot-password', { email: EMAIL }), await get(app, '/api/profile')]) {
      expect(res.status).toBe(503)
    }
  })
})

describe('per-email cooldown (one email of each kind per address per minute)', () => {
  it('forgot-password sends at most one reset email per minute, and answers identically either way', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    await waitForMail(ctx.sent, 1)
    const responses = [await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })]
    await waitForMail(ctx.sent, 2)
    responses.push(await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL }))
    responses.push(await post(ctx.app, '/api/auth/forgot-password', { email: ' Learner@Example.com' }))
    for (const res of responses) {
      expect(res.status).toBe(202)
      expect(res.body).toEqual(FORGOT_PASSWORD_RESPONSE)
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(ctx.sent).toHaveLength(2)

    ctx.advance(EMAIL_COOLDOWN_MS)
    await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(ctx.sent, 3)
  })

  it('applies to unknown addresses the same way, so it cannot reveal accounts', async () => {
    const ctx = setup()
    const statuses: number[] = []
    for (let i = 0; i < 2; i++) {
      const res = await post(ctx.app, '/api/auth/forgot-password', { email: 'nobody@example.com' })
      statuses.push(res.status)
      expect(res.body).toEqual(FORGOT_PASSWORD_RESPONSE)
    }
    expect(statuses).toEqual([202, 202])
  })

  it('is per address: another account is not affected', async () => {
    const ctx = setup()
    await signUp(ctx.app, 'a@example.com')
    await signUp(ctx.app, 'b@example.com')
    await waitForMail(ctx.sent, 2)
    await post(ctx.app, '/api/auth/forgot-password', { email: 'a@example.com' })
    await post(ctx.app, '/api/auth/forgot-password', { email: 'b@example.com' })
    await waitForMail(ctx.sent, 4)
    expect(ctx.sent.slice(2).map((m) => m.to).sort()).toEqual(['a@example.com', 'b@example.com'])
  })

  it('request-verification within a minute of the last verification email is 429, then works again', async () => {
    const ctx = setup()
    const session = await signUp(ctx.app)
    await waitForMail(ctx.sent, 1)
    const early = await post(ctx.app, '/api/auth/request-verification', {}, session)
    expect(early.status).toBe(429)
    expect(early.body).toEqual({ error: { code: 'email_cooldown', message: 'An email was sent recently. Please wait a minute before asking again', requestId: expect.any(String) } })
    ctx.advance(EMAIL_COOLDOWN_MS - 1)
    expect((await post(ctx.app, '/api/auth/request-verification', {}, session)).status).toBe(429)
    ctx.advance(1)
    expect((await post(ctx.app, '/api/auth/request-verification', {}, session)).status).toBe(202)
    expect((await post(ctx.app, '/api/auth/request-verification', {}, session)).status).toBe(429)
    expect(ctx.sent).toHaveLength(2)
  })

  it('the reset and verification cooldowns are independent', async () => {
    const ctx = setup()
    await signUp(ctx.app)
    await waitForMail(ctx.sent, 1)
    await post(ctx.app, '/api/auth/forgot-password', { email: EMAIL })
    await waitForMail(ctx.sent, 2)
  })
})
