import { randomUUID } from 'node:crypto'
import mongoose from 'mongoose'
import request from 'supertest'
import { afterAll, describe, expect, it } from 'vitest'
import { createDatabase } from '../src/services/database.js'
import { capturingLogger, testApp, withDatabaseName } from './helpers.js'

/**
 * Opt-in: runs only when MONGODB_URI_TEST is set (never in CI). The URI's
 * database name is replaced with a throwaway one that is dropped afterwards,
 * so it is safe to point at the same cluster as development.
 *
 *   MONGODB_URI_TEST='mongodb+srv://…' npm test
 */
const baseUri = process.env.MONGODB_URI_TEST

describe.skipIf(!baseUri)('MongoDB integration (MONGODB_URI_TEST)', () => {
  // The body is still collected when skipped, so only build the URI when one was given.
  const uri = baseUri ? withDatabaseName(baseUri, `grammar-ielts-it-${randomUUID().slice(0, 8)}`) : ''
  const { logger, lines } = capturingLogger()
  const db = createDatabase({ uri, logger, serverSelectionTimeoutMS: 10_000 })

  afterAll(async () => {
    await db.disconnect()
  })

  it('connects and reports ready', async () => {
    await db.connect()
    expect(db.state()).toBe('connected')
    const res = await request(testApp({ db })).get('/api/health/ready')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', database: 'connected' })
  }, 20_000)

  it('can write and read in the throwaway database, then drops it', async () => {
    const connection = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 10_000 }).asPromise()
    try {
      const collection = connection.collection('integration_probe')
      await collection.insertOne({ probe: true })
      expect(await collection.countDocuments({ probe: true })).toBe(1)
    } finally {
      await connection.dropDatabase()
      await connection.close()
    }
  }, 20_000)

  it('never logs the credentials', () => {
    const password = /^mongodb(?:\+srv)?:\/\/[^:@/]+:([^@/]+)@/.exec(uri)?.[1]
    if (password) expect(lines.join('\n')).not.toContain(password)
  })
})

describe('withDatabaseName', () => {
  it.each([
    ['mongodb+srv://u:p@cluster0.example.net/app?retryWrites=true&w=majority', 'mongodb+srv://u:p@cluster0.example.net/tmp?retryWrites=true&w=majority'],
    ['mongodb://127.0.0.1:27017', 'mongodb://127.0.0.1:27017/tmp'],
    ['mongodb://a:1,b:2/app', 'mongodb://a:1,b:2/tmp'],
  ])('%s', (input, expected) => {
    expect(withDatabaseName(input, 'tmp')).toBe(expected)
  })
})
