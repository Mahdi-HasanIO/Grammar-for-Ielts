import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMongoRepositories } from '../src/repositories/mongo.js'
import { createDatabase } from '../src/services/database.js'
import { fakeDb, mailToken, silentLogger, testApp, testServices, withDatabaseName } from './helpers.js'
import { EMAIL, get, isSignedIn, NEW_PASSWORD, patch, PASSWORD, post, signIn, signUp } from './http.js'

/**
 * Opt-in: runs only when MONGODB_URI_TEST is set (never in CI). Uses a
 * throwaway database that is dropped afterwards.
 *
 *   MONGODB_URI_TEST='mongodb+srv://…' npm test
 */
const baseUri = process.env.MONGODB_URI_TEST

describe.skipIf(!baseUri)('account and profile against MongoDB (MONGODB_URI_TEST)', () => {
  // The body is still collected when skipped, so only build the URI when one was given.
  const uri = baseUri ? withDatabaseName(baseUri, `grammar-ielts-it-${randomUUID().slice(0, 8)}`) : ''
  const db = createDatabase({ uri, logger: silentLogger(), serverSelectionTimeoutMS: 10_000 })
  const repositories = createMongoRepositories(db.connection)
  const services = testServices({ repositories })
  const app = testApp({ ...services, db: fakeDb('connected') })

  beforeAll(async () => {
    await db.connect()
    expect(db.state()).toBe('connected')
    await db.connection.syncIndexes()
  }, 30_000)

  afterAll(async () => {
    if (db.state() === 'connected') await db.connection.dropDatabase()
    await db.disconnect()
  }, 30_000)

  it('account_tokens has the unique token hash, one-per-user-and-type and TTL indexes', async () => {
    const indexes = await db.connection.collection('account_tokens').indexes()
    expect(indexes.find((i) => i.key.tokenHash === 1)?.unique).toBe(true)
    expect(indexes.find((i) => i.key.userId === 1 && i.key.type === 1)?.unique).toBe(true)
    expect(indexes.find((i) => i.key.expiresAt === 1)?.expireAfterSeconds).toBe(0)
  })

  it('register -> verify email -> forgot -> reset ends every session -> login with the new password', async () => {
    const first = await signUp(app)
    const second = await signIn(app)

    expect((await post(app, '/api/auth/verify-email', { token: await mailToken(services.sent, '/verify-email') })).status).toBe(204)
    expect((await get(app, '/api/auth/me', first)).body.user.emailVerifiedAt).toMatch(/^\d{4}-/)

    const sentBefore = services.sent.length
    expect((await post(app, '/api/auth/forgot-password', { email: EMAIL })).status).toBe(202)
    await expect.poll(() => services.sent.length).toBeGreaterThan(sentBefore)
    const resetToken = await mailToken(services.sent, '/reset-password')

    const stored = await db.connection.collection('account_tokens').find({}).toArray()
    expect(stored).toHaveLength(1)
    expect(stored[0]?.tokenHash).toMatch(/^[0-9a-f]{64}$/)
    expect(JSON.stringify(stored)).not.toContain(resetToken)

    expect((await post(app, '/api/auth/reset-password', { token: resetToken, password: NEW_PASSWORD })).status).toBe(204)
    expect(await isSignedIn(app, first)).toBe(false)
    expect(await isSignedIn(app, second)).toBe(false)
    expect((await post(app, '/api/auth/reset-password', { token: resetToken, password: PASSWORD })).status).toBe(400)
    expect(await db.connection.collection('account_tokens').countDocuments()).toBe(0)

    const current = await signIn(app, EMAIL, NEW_PASSWORD)
    const other = await signIn(app, EMAIL, NEW_PASSWORD)
    expect((await post(app, '/api/auth/change-password', { currentPassword: NEW_PASSWORD, newPassword: PASSWORD }, current)).status).toBe(204)
    expect(await isSignedIn(app, current)).toBe(true)
    expect(await isSignedIn(app, other)).toBe(false)
  }, 60_000)

  it('a second request replaces the first token in place', async () => {
    const user = await repositories.users.findByEmail(EMAIL)
    if (!user) throw new Error('user missing')
    const expiresAt = new Date(Date.now() + 60_000)
    await repositories.accountTokens.replace({ tokenHash: 'a'.repeat(64), userId: user.id, type: 'password_reset', expiresAt })
    await repositories.accountTokens.replace({ tokenHash: 'b'.repeat(64), userId: user.id, type: 'password_reset', expiresAt })
    expect(await repositories.accountTokens.consume('a'.repeat(64), 'password_reset')).toBeNull()
    expect(await repositories.accountTokens.consume('b'.repeat(64), 'email_verification')).toBeNull()
    expect((await repositories.accountTokens.consume('b'.repeat(64), 'password_reset'))?.userId).toBe(user.id)
  })

  it('two concurrent uses of one token: exactly one succeeds', async () => {
    const user = await repositories.users.findByEmail(EMAIL)
    if (!user) throw new Error('user missing')
    await repositories.accountTokens.replace({ tokenHash: 'c'.repeat(64), userId: user.id, type: 'email_verification', expiresAt: new Date(Date.now() + 60_000) })
    const results = await Promise.all([1, 2, 3].map(() => repositories.accountTokens.consume('c'.repeat(64), 'email_verification')))
    expect(results.filter(Boolean)).toHaveLength(1)
  })

  it('profile PATCH sets and clears fields in the document', async () => {
    const token = await signIn(app)
    const res = await patch(app, '/api/profile', { displayName: 'Rafi', targetBand: 7.5, timezone: 'Asia/Dhaka', examDate: '2026-12-05' }, token)
    expect(res.status).toBe(200)
    await patch(app, '/api/profile', { examDate: null }, token)
    const doc = await db.connection.collection('users').findOne({ email: EMAIL })
    expect(doc).toMatchObject({ displayName: 'Rafi', targetBand: 7.5, timezone: 'Asia/Dhaka' })
    expect(doc && 'examDate' in doc).toBe(false)
    expect((await get(app, '/api/profile', token)).body.profile.examDate).toBeNull()
  }, 30_000)
})
