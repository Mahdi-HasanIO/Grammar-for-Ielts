import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMongoRepositories } from '../src/repositories/mongo.js'
import { DuplicateEmailError } from '../src/repositories/types.js'
import { createAuthService } from '../src/services/auth.js'
import { createDatabase } from '../src/services/database.js'
import { fakeDb, fastHasher, silentLogger, TEST_ENV, testApp, withDatabaseName } from './helpers.js'

/**
 * Opt-in: runs only when MONGODB_URI_TEST is set (never in CI). Uses a
 * throwaway database that is dropped afterwards.
 *
 *   MONGODB_URI_TEST='mongodb+srv://…' npm test
 */
const baseUri = process.env.MONGODB_URI_TEST

describe.skipIf(!baseUri)('auth against MongoDB (MONGODB_URI_TEST)', () => {
  // The body is still collected when skipped, so only build the URI when one was given.
  const uri = baseUri ? withDatabaseName(baseUri, `grammar-ielts-it-${randomUUID().slice(0, 8)}`) : ''
  const db = createDatabase({ uri, logger: silentLogger(), serverSelectionTimeoutMS: 10_000 })
  const repositories = createMongoRepositories(db.connection)
  const auth = createAuthService({ repositories, hasher: fastHasher() })
  const app = testApp({ auth, db: fakeDb('connected') })
  const COOKIE = TEST_ENV.SESSION_COOKIE_NAME

  beforeAll(async () => {
    await db.connect()
    expect(db.state()).toBe('connected')
    // Build the unique and TTL indexes before testing behaviour that relies on them.
    await db.connection.syncIndexes()
  }, 30_000)

  afterAll(async () => {
    if (db.state() === 'connected') await db.connection.dropDatabase()
    await db.disconnect()
  }, 30_000)

  it('register -> me -> logout -> me is 401', async () => {
    const registered = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({ email: 'Learner@Example.com', password: 'correct horse battery' })
    expect(registered.status).toBe(201)
    const setCookie = (registered.headers['set-cookie'] as unknown as string[])[0] ?? ''
    const cookie = setCookie.split(';')[0] ?? ''
    expect(cookie.startsWith(`${COOKIE}=`)).toBe(true)

    const me = await request(app).get('/api/auth/me').set('Cookie', cookie)
    expect(me.status).toBe(200)
    expect(me.body.user.email).toBe('learner@example.com')
    expect(me.body.user.id).toMatch(/^[0-9a-f]{24}$/)

    const login = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'learner@example.com', password: 'correct horse battery' })
    expect(login.status).toBe(200)

    const logout = await request(app).post('/api/auth/logout').set('Content-Type', 'application/json').set('Cookie', cookie)
    expect(logout.status).toBe(204)
    expect((await request(app).get('/api/auth/me').set('Cookie', cookie)).status).toBe(401)
  }, 30_000)

  it('stores a hashed password and a hashed token, with the TTL index on sessions', async () => {
    const user = await db.connection.collection('users').findOne({ email: 'learner@example.com' })
    expect(user?.passwordHash).toMatch(/^\$argon2id\$/)
    expect(Object.keys(user ?? {}).sort()).toEqual(['_id', 'createdAt', 'email', 'passwordHash'])

    const session = await db.connection.collection('sessions').findOne({ userId: user?._id })
    expect(session?.tokenHash).toMatch(/^[0-9a-f]{64}$/)

    const indexes = await db.connection.collection('sessions').indexes()
    expect(indexes.find((index) => index.key.expiresAt === 1)?.expireAfterSeconds).toBe(0)
    expect(indexes.find((index) => index.key.tokenHash === 1)?.unique).toBe(true)
  })

  it('the unique index rejects a duplicate email even when two registrations race', async () => {
    const results = await Promise.allSettled([
      repositories.users.create({ email: 'race@example.com', passwordHash: 'x' }),
      repositories.users.create({ email: 'race@example.com', passwordHash: 'y' }),
    ])
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((r) => r.status === 'rejected')
    expect(rejected?.status === 'rejected' && rejected.reason).toBeInstanceOf(DuplicateEmailError)
  })

  it('finds nothing for an id that is not an ObjectId', async () => {
    expect(await repositories.users.findById('not-an-object-id')).toBeNull()
  })
})
