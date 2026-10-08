import { createHash } from 'node:crypto'
import request, { type Response } from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import type { Express } from 'express'
import { createMemoryRepositories } from '../src/repositories/memory.js'
import { SESSION_TTL_MS } from '../src/services/auth.js'
import { ALLOWED_ORIGIN, capturingLogger, fastHasher, TEST_ENV, testApp, testAuth } from './helpers.js'

const COOKIE = TEST_ENV.SESSION_COOKIE_NAME
const EMAIL = 'learner@example.com'
const PASSWORD = 'correct horse battery'

/** The session Set-Cookie header, if any. */
function setCookie(res: Response): string | undefined {
  const headers = res.headers['set-cookie'] as unknown as string[] | undefined
  return headers?.find((header) => header.startsWith(`${COOKIE}=`))
}

function tokenFrom(res: Response): string {
  const header = setCookie(res)
  if (!header) throw new Error('no session cookie set')
  return header.slice(COOKIE.length + 1).split(';')[0] ?? ''
}

const cookieHeader = (token: string) => `${COOKIE}=${token}`

const post = (app: Express, path: string, body?: object) =>
  request(app)
    .post(path)
    .set('Content-Type', 'application/json')
    .send(body ?? {})

const register = (app: Express, email = EMAIL, password = PASSWORD) => post(app, '/api/auth/register', { email, password })
const login = (app: Express, email = EMAIL, password = PASSWORD) => post(app, '/api/auth/login', { email, password })
const me = (app: Express, token?: string) => {
  const req = request(app).get('/api/auth/me')
  return token === undefined ? req : req.set('Cookie', cookieHeader(token))
}

/** An app with a controllable clock and access to the in-memory repositories. */
function appWithClock(start = new Date('2026-01-01T00:00:00Z')) {
  let now = start
  const { auth, repositories } = testAuth({ now: () => now })
  return {
    app: testApp({ auth }),
    repositories,
    advance: (ms: number) => {
      now = new Date(now.getTime() + ms)
    },
  }
}

describe('register', () => {
  it('creates the account, returns the public user and sets the session cookie', async () => {
    const res = await register(testApp())
    expect(res.status).toBe(201)
    expect(Object.keys(res.body.user).sort()).toEqual(['createdAt', 'email', 'emailVerifiedAt', 'id', 'plan', 'role'])
    expect(res.body.user.plan).toBe('free')
    expect(res.body.user.role).toBe('user')
    expect(res.body.user.emailVerifiedAt).toBeNull()
    expect(res.body.user.email).toBe(EMAIL)
    expect(tokenFrom(res)).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })

  it('sets the cookie httpOnly, SameSite=Lax, path / with a 14-day expiry, and not Secure outside production', async () => {
    const before = Date.now()
    const header = setCookie(await register(testApp())) ?? ''
    expect(header).toMatch(/; HttpOnly/)
    expect(header).toMatch(/; SameSite=Lax/)
    expect(header).toMatch(/; Path=\//)
    expect(header).not.toMatch(/; Secure/)
    const expires = Date.parse(/; Expires=([^;]+)/.exec(header)?.[1] ?? '')
    expect(expires - before).toBeGreaterThan(SESSION_TTL_MS - 5_000)
    expect(expires - before).toBeLessThanOrEqual(SESSION_TTL_MS + 1_000)
  })

  it('marks the cookie Secure in production', async () => {
    const header = setCookie(await register(testApp({ env: { ...TEST_ENV, NODE_ENV: 'production' } })))
    expect(header).toMatch(/; Secure/)
  })

  it('uses the configured cookie name', async () => {
    const res = await register(testApp({ env: { ...TEST_ENV, SESSION_COOKIE_NAME: 'custom_sid' } }))
    expect((res.headers['set-cookie'] as unknown as string[])[0]).toMatch(/^custom_sid=/)
  })

  it('normalises the email (trimmed, lowercased)', async () => {
    const res = await register(testApp(), '  Learner@Example.COM ')
    expect(res.body.user.email).toBe(EMAIL)
  })

  it('returns 409 for an email that is already registered, in any letter case', async () => {
    const app = testApp()
    expect((await register(app)).status).toBe(201)
    const res = await register(app, 'LEARNER@example.com', 'another password')
    expect(res.status).toBe(409)
    expect(res.body).toEqual({ error: { code: 'email_taken', message: 'An account with this email already exists', requestId: expect.any(String) } })
    expect(setCookie(res)).toBeUndefined()
  })

  it('stores an argon2id hash, never the password, and only the SHA-256 of the session token', async () => {
    const { auth, repositories } = testAuth()
    const res = await register(testApp({ auth }))
    const user = await repositories.users.findByEmail(EMAIL)
    expect(user?.passwordHash).toMatch(/^\$argon2id\$/)
    expect(user?.passwordHash).not.toContain(PASSWORD)

    const token = tokenFrom(res)
    expect(await repositories.sessions.findByTokenHash(token)).toBeNull()
    const session = await repositories.sessions.findByTokenHash(createHash('sha256').update(token).digest('hex'))
    expect(session?.userId).toBe(user?.id)
  })
})

describe('input validation', () => {
  it.each([
    ['missing email', { password: PASSWORD }, 'email'],
    ['missing password', { email: EMAIL }, 'password'],
    ['invalid email', { email: 'not-an-email', password: PASSWORD }, 'email'],
    ['non-string email', { email: 42, password: PASSWORD }, 'email'],
    ['password of 9 characters', { email: EMAIL, password: '123456789' }, 'password'],
    ['password of 129 characters', { email: EMAIL, password: 'x'.repeat(129) }, 'password'],
  ])('rejects %s with 400', async (_name, body, field) => {
    for (const path of ['/api/auth/register', '/api/auth/login']) {
      const res = await post(testApp(), path, body)
      expect(res.status).toBe(400)
      expect(res.body.error.code).toBe('validation_error')
      expect(res.body.error.details.map((d: { path: string }) => d.path)).toContain(field)
      expect(JSON.stringify(res.body)).not.toContain(PASSWORD)
    }
  })

  it('accepts passwords of exactly 10 and 128 characters', async () => {
    const app = testApp()
    expect((await register(app, 'a@example.com', 'x'.repeat(10))).status).toBe(201)
    expect((await register(app, 'b@example.com', 'x'.repeat(128))).status).toBe(201)
  })

  it('returns 400 for malformed JSON', async () => {
    const res = await request(testApp()).post('/api/auth/login').set('Content-Type', 'application/json').send('{"email":')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('invalid_json')
  })
})

describe('login', () => {
  it('signs in with the right password (email in any case) and starts a new session', async () => {
    const app = testApp()
    const first = tokenFrom(await register(app))
    const res = await login(app, ' LEARNER@Example.com')
    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(EMAIL)
    const second = tokenFrom(res)
    expect(second).not.toBe(first)
    expect((await me(app, first)).status).toBe(200)
    expect((await me(app, second)).status).toBe(200)
  })

  it('gives an identical 401 for a wrong password and an unknown email', async () => {
    const app = testApp()
    await register(app)
    const wrongPassword = await login(app, EMAIL, 'wrong password!')
    const unknownEmail = await login(app, 'nobody@example.com', PASSWORD)
    for (const res of [wrongPassword, unknownEmail]) {
      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: { code: 'invalid_credentials', message: 'Invalid email or password', requestId: expect.any(String) } })
      expect(setCookie(res)).toBeUndefined()
    }
  })

  it('still runs a password check for an unknown email, so timing does not reveal accounts', async () => {
    const hasher = fastHasher()
    const verify = vi.spyOn(hasher, 'verify')
    const { auth } = testAuth({ hasher })
    const res = await login(testApp({ auth }), 'nobody@example.com', PASSWORD)
    expect(res.status).toBe(401)
    expect(verify).toHaveBeenCalledTimes(1)
    expect(verify.mock.calls[0]?.[0]).toMatch(/^\$argon2id\$/)
  })
})

describe('me and logout', () => {
  it('register -> me -> logout -> me is 401', async () => {
    const app = testApp()
    const registered = await register(app)
    const token = tokenFrom(registered)

    const current = await me(app, token)
    expect(current.status).toBe(200)
    expect(current.body).toEqual({ user: registered.body.user })

    const out = await post(app, '/api/auth/logout').set('Cookie', cookieHeader(token))
    expect(out.status).toBe(204)
    expect(setCookie(out)).toMatch(new RegExp(`^${COOKIE}=;.*Expires=Thu, 01 Jan 1970`))

    const after = await me(app, token)
    expect(after.status).toBe(401)
    expect(after.body).toEqual({ error: { code: 'unauthenticated', message: 'Authentication required', requestId: expect.any(String) } })
  })

  it('returns 401 without a cookie, and sets no cookie', async () => {
    const res = await me(testApp())
    expect(res.status).toBe(401)
    expect(setCookie(res)).toBeUndefined()
  })

  it('logout without a session is still 204 and clears the cookie', async () => {
    const res = await post(testApp(), '/api/auth/logout')
    expect(res.status).toBe(204)
    expect(setCookie(res)).toBeDefined()
  })
})

describe('session validation', () => {
  it('rejects an expired session, clears the cookie and deletes the session', async () => {
    const { app, repositories, advance } = appWithClock()
    const token = tokenFrom(await register(app))
    advance(SESSION_TTL_MS - 1)
    expect((await me(app, token)).status).toBe(200)

    advance(1)
    const res = await me(app, token)
    expect(res.status).toBe(401)
    expect(setCookie(res)).toMatch(/Expires=Thu, 01 Jan 1970/)
    expect(await repositories.sessions.findByTokenHash(createHash('sha256').update(token).digest('hex'))).toBeNull()
  })

  it.each([
    ['one character changed', (token: string) => (token[0] === 'A' ? 'B' : 'A') + token.slice(1)],
    ['truncated', (token: string) => token.slice(0, -1)],
    ['extended', (token: string) => `${token}A`],
    ['garbage', () => 'not-a-token'],
    ['empty', () => ''],
  ])('rejects a tampered cookie (%s) and clears it', async (_name, tamper) => {
    const app = testApp()
    const token = tokenFrom(await register(app))
    const res = await me(app, tamper(token))
    expect(res.status).toBe(401)
    expect(setCookie(res)).toMatch(/Expires=Thu, 01 Jan 1970/)
    expect((await me(app, token)).status).toBe(200)
  })
})

describe('secrets never leave the server', () => {
  it('responses contain no password, hash or token', async () => {
    const app = testApp()
    const registered = await register(app)
    const token = tokenFrom(registered)
    const responses = [registered, await login(app), await me(app, token)]
    for (const res of responses) {
      expect(res.text).not.toMatch(/passwordHash|\$argon2|tokenHash/)
      expect(res.text).not.toContain(PASSWORD)
      expect(res.text).not.toContain(token)
    }
  })

  it('logs contain no password, hash, token or cookie', async () => {
    const { logger, lines } = capturingLogger()
    const app = testApp({ logger })
    const token = tokenFrom(await register(app))
    await login(app)
    await login(app, EMAIL, 'wrong password!')
    await me(app, token)
    await post(app, '/api/auth/logout').set('Cookie', cookieHeader(token))
    const all = lines.join('\n')
    expect(lines.length).toBeGreaterThan(0)
    expect(all).not.toContain(PASSWORD)
    expect(all).not.toContain(token)
    expect(all).not.toMatch(/\$argon2|passwordHash|set-cookie|gfi_session/i)
  })
})

describe('CSRF protection on state-changing auth routes', () => {
  it.each(['/api/auth/register', '/api/auth/login', '/api/auth/logout'])('%s rejects a disallowed Origin with 403', async (path) => {
    const res = await post(testApp(), path, { email: EMAIL, password: PASSWORD }).set('Origin', 'https://evil.example.com')
    expect(res.status).toBe(403)
    expect(res.body).toEqual({ error: { code: 'origin_not_allowed', message: 'Request origin is not allowed', requestId: expect.any(String) } })
  })

  it('rejects "Origin: null" (sandboxed frames, some redirects)', async () => {
    expect((await register(testApp()).set('Origin', 'null')).status).toBe(403)
  })

  it('allows an allowlisted Origin and requests without Origin', async () => {
    const app = testApp()
    expect((await register(app, 'a@example.com').set('Origin', ALLOWED_ORIGIN)).status).toBe(201)
    expect((await register(app, 'b@example.com')).status).toBe(201)
  })

  it('does not create an account or end a session for a rejected request', async () => {
    const { auth, repositories } = testAuth()
    const app = testApp({ auth })
    const evil = await register(app, 'victim@example.com').set('Origin', 'https://evil.example.com')
    expect(evil.status).toBe(403)
    expect(await repositories.users.findByEmail('victim@example.com')).toBeNull()

    const token = tokenFrom(await register(app))
    const logout = await post(app, '/api/auth/logout').set('Cookie', cookieHeader(token)).set('Origin', 'https://evil.example.com')
    expect(logout.status).toBe(403)
    expect((await me(app, token)).status).toBe(200)
  })

  it.each([
    ['text/plain', JSON.stringify({ email: EMAIL, password: PASSWORD })],
    ['application/x-www-form-urlencoded', `email=${EMAIL}&password=${PASSWORD}`],
    ['multipart/form-data; boundary=x', '--x--'],
  ])('rejects Content-Type %s with 415 (what an HTML form can send)', async (type, body) => {
    for (const path of ['/api/auth/register', '/api/auth/login', '/api/auth/logout']) {
      const res = await request(testApp()).post(path).set('Content-Type', type).send(body)
      expect(res.status).toBe(415)
      expect(res.body.error.code).toBe('unsupported_media_type')
    }
  })

  it('accepts application/json with a charset parameter', async () => {
    const res = await request(testApp())
      .post('/api/auth/register')
      .set('Content-Type', 'application/json; charset=utf-8')
      .send(JSON.stringify({ email: EMAIL, password: PASSWORD }))
    expect(res.status).toBe(201)
  })

  it('answers a credentialed preflight from an allowed origin only', async () => {
    const preflight = (origin: string) =>
      request(testApp())
        .options('/api/auth/login')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'content-type')
    const allowed = await preflight(ALLOWED_ORIGIN)
    expect(allowed.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN)
    expect(allowed.headers['access-control-allow-credentials']).toBe('true')
    const denied = await preflight('https://evil.example.com')
    expect(denied.headers['access-control-allow-origin']).toBeUndefined()
    expect(denied.headers['access-control-allow-credentials']).toBeUndefined()
  })
})

describe('auth rate limit', () => {
  it('limits /api/auth/* per IP more strictly than the global limit', async () => {
    const app = testApp({ authRateLimit: { windowMs: 60_000, limit: 3 } })
    expect((await login(app)).status).toBe(401)
    expect((await me(app)).status).toBe(401)
    expect((await post(app, '/api/auth/logout')).status).toBe(204)

    const limited = await login(app)
    expect(limited.status).toBe(429)
    expect(limited.body).toEqual({ error: { code: 'rate_limited', message: 'Too many requests, please try again later', requestId: expect.any(String) } })
    expect(limited.headers['ratelimit-policy']).toMatch(/"auth"; q=3; w=60/)
    expect((await me(app)).status).toBe(429)

    // Other routes have their own (global) counter.
    expect((await request(app).get('/api/health')).status).toBe(200)
    expect((await request(app).get('/api/other')).status).toBe(404)
  })

  it('defaults to 50 per 15 minutes, applied on top of the global 300', async () => {
    const policy = (await me(testApp())).headers['ratelimit-policy']
    expect(policy).toMatch(/"300-in-15min"; q=300; w=900/)
    expect(policy).toMatch(/"auth"; q=50; w=900/)
  })
})

describe('memory repositories', () => {
  it('copy records, so callers cannot change stored data', async () => {
    const { users } = createMemoryRepositories()
    const created = await users.create({ email: EMAIL, passwordHash: 'h' })
    created.email = 'changed@example.com'
    expect((await users.findById(created.id))?.email).toBe(EMAIL)
  })
})
