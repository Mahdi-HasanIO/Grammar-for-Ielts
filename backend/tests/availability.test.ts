import mongoose, { mongo } from 'mongoose'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { toAppError } from '../src/middleware/errorHandler.js'
import { createMemoryRepositories } from '../src/repositories/memory.js'
import type { Repositories } from '../src/repositories/types.js'
import { isDatabaseUnavailableError, type DatabaseState } from '../src/services/database.js'
import { capturingLogger, fakeDb, testApp, testAuth } from './helpers.js'

const SERVICE_UNAVAILABLE = {
  error: { code: 'service_unavailable', message: 'Service temporarily unavailable, please try again shortly' },
}
const CREDENTIALS = { email: 'learner@example.com', password: 'correct horse battery' }

/** Well-formed (43 base64url characters), so logout and me actually look the session up. */
const TOKEN = 'A'.repeat(43)

const authRequests = [
  ['POST /api/auth/register', (app: ReturnType<typeof testApp>) => request(app).post('/api/auth/register').set('Content-Type', 'application/json').send(CREDENTIALS)],
  ['POST /api/auth/login', (app: ReturnType<typeof testApp>) => request(app).post('/api/auth/login').set('Content-Type', 'application/json').send(CREDENTIALS)],
  ['POST /api/auth/logout', (app: ReturnType<typeof testApp>) => request(app).post('/api/auth/logout').set('Content-Type', 'application/json').set('Cookie', `gfi_session=${TOKEN}`).send({})],
  ['GET /api/auth/me', (app: ReturnType<typeof testApp>) => request(app).get('/api/auth/me').set('Cookie', `gfi_session=${TOKEN}`)],
] as const

// What the driver throws when MongoDB cannot be reached. Constructed directly; the shapes match the real errors.
const unreachableErrors: [string, () => Error][] = [
  ['MongooseServerSelectionError', () => new mongoose.Error.MongooseServerSelectionError('Could not connect to any servers')],
  ['MongoServerSelectionError', () => new mongo.MongoServerSelectionError('Server selection timed out', {} as never)],
  ['MongoNetworkError', () => new mongo.MongoNetworkError('connection reset')],
  ['MongoNotConnectedError', () => new mongo.MongoNotConnectedError('not connected')],
  ['MongoTopologyClosedError', () => new mongo.MongoTopologyClosedError()],
]

/** Repositories whose every call fails with the given error, as if the connection dropped mid-request. */
function failingRepositories(makeError: () => Error): Repositories {
  const fail = async () => {
    throw makeError()
  }
  return {
    users: { create: fail, findByEmail: fail, findById: fail },
    sessions: { create: fail, findByTokenHash: fail, deleteByTokenHash: fail },
  }
}

describe('auth routes while MongoDB is not connected', () => {
  describe.each<DatabaseState>(['disconnected', 'connecting', 'disconnecting'])('state %s', (state) => {
    it.each(authRequests)('%s returns 503 service_unavailable without touching the database', async (_name, send) => {
      const { auth } = testAuth({ repositories: failingRepositories(() => new Error('repository must not be called')) })
      const res = await send(testApp({ db: fakeDb(state), auth }))
      expect(res.status).toBe(503)
      expect(res.body).toEqual(SERVICE_UNAVAILABLE)
      expect(res.headers['set-cookie']).toBeUndefined()
    })
  })

  it('does not include a stack, even in development (an outage is not a bug)', async () => {
    const app = testApp({ db: fakeDb('disconnected'), env: { NODE_ENV: 'development', CORS_ORIGINS: [], SESSION_COOKIE_NAME: 'gfi_session' } })
    const res = await authRequests[1][1](app)
    expect(res.body).toEqual(SERVICE_UNAVAILABLE)
  })

  it('leaves health checks as they were: liveness 200, readiness 503', async () => {
    const app = testApp({ db: fakeDb('disconnected') })
    expect((await request(app).get('/api/health')).status).toBe(200)
    expect((await request(app).get('/api/health/ready')).status).toBe(503)
  })

  it('works again once the database is back', async () => {
    let state: DatabaseState = 'disconnected'
    const app = testApp({ db: { state: () => state } })
    expect((await authRequests[0][1](app)).status).toBe(503)
    state = 'connected'
    expect((await authRequests[0][1](app)).status).toBe(201)
  })
})

describe('auth routes when the connection drops mid-request', () => {
  it.each(unreachableErrors)('%s becomes 503 service_unavailable', async (_name, makeError) => {
    const { auth } = testAuth({ repositories: failingRepositories(makeError) })
    const app = testApp({ db: fakeDb('connected'), auth })
    for (const [, send] of authRequests) {
      const res = await send(app)
      expect(res.status).toBe(503)
      expect(res.body).toEqual(SERVICE_UNAVAILABLE)
    }
  })

  it('other errors are still a generic 500', async () => {
    const { auth } = testAuth({ repositories: failingRepositories(() => new Error('bug')) })
    const res = await authRequests[1][1](testApp({ auth }))
    expect(res.status).toBe(500)
    expect(res.body.error.code).toBe('internal_error')
  })

  it('logs the outage as an error without credentials', async () => {
    const { logger, lines } = capturingLogger()
    const { auth } = testAuth({ repositories: failingRepositories(() => new mongo.MongoNetworkError('connection reset')) })
    await authRequests[1][1](testApp({ auth, logger }))
    const failure = lines.map((l) => JSON.parse(l)).find((entry) => entry.msg === 'Request failed')
    expect(failure).toMatchObject({ level: 50, err: { type: 'MongoNetworkError' } })
    expect(lines.join('\n')).not.toContain(CREDENTIALS.password)
  })
})

describe('isDatabaseUnavailableError', () => {
  it.each(unreachableErrors)('is true for %s', (_name, makeError) => {
    expect(isDatabaseUnavailableError(makeError())).toBe(true)
    expect(toAppError(makeError()).status).toBe(503)
  })

  it.each([
    ['a duplicate key error', new mongo.MongoServerError({ message: 'E11000 duplicate key', code: 11000 })],
    ['a plain Error', new Error('bug')],
    ['a non-error value', 'oops'],
  ])('is false for %s', (_name, error) => {
    expect(isDatabaseUnavailableError(error)).toBe(false)
  })
})

describe('the in-memory repositories', () => {
  it('are unaffected (sanity check for the fakes above)', async () => {
    expect(await createMemoryRepositories().users.findByEmail('x@example.com')).toBeNull()
  })
})
