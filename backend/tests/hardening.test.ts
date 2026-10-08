import mongoose from 'mongoose'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createDatabase } from '../src/services/database.js'
import { silentLogger, TEST_ENV, testApp } from './helpers.js'
import { patch, signUp } from './http.js'

describe('compression', () => {
  it('gzips a large JSON response when the client accepts it', async () => {
    const app = testApp()
    const token = await signUp(app)
    // A validation error naming 150 unknown fields is well over the 1 kB threshold.
    const body = Object.fromEntries(Array.from({ length: 150 }, (_, i) => [`unknownField${i}`, 1]))
    const res = await patch(app, '/api/profile', body, token).set('Accept-Encoding', 'gzip')
    expect(res.status).toBe(400)
    expect(res.headers['content-encoding']).toBe('gzip')
    expect(res.body.error.code).toBe('validation_error')
  })

  it('leaves small responses and clients without Accept-Encoding uncompressed', async () => {
    const app = testApp()
    expect((await request(app).get('/api/health').set('Accept-Encoding', 'gzip')).headers['content-encoding']).toBeUndefined()
    const token = await signUp(app)
    const body = Object.fromEntries(Array.from({ length: 150 }, (_, i) => [`unknownField${i}`, 1]))
    const res = await patch(app, '/api/profile', body, token).set('Accept-Encoding', 'identity')
    expect(res.headers['content-encoding']).toBeUndefined()
  })
})

describe('trust proxy (TRUST_PROXY)', () => {
  const twoClients = async (trustProxy: number) => {
    const app = testApp({ env: { ...TEST_ENV, TRUST_PROXY: trustProxy }, authRateLimit: { windowMs: 60_000, limit: 1 } })
    const first = await request(app).get('/api/auth/me').set('X-Forwarded-For', '203.0.113.1')
    const second = await request(app).get('/api/auth/me').set('X-Forwarded-For', '203.0.113.2')
    return [first.status, second.status]
  }

  it('is off by default: X-Forwarded-For is ignored, so both requests share one per-IP counter', async () => {
    expect(await twoClients(0)).toEqual([401, 429])
  })

  it('with TRUST_PROXY=1 the client IP comes from X-Forwarded-For, so each client has its own counter', async () => {
    expect(await twoClients(1)).toEqual([401, 401])
  })
})

describe('MongoDB pool and timeouts', () => {
  it('passes the configured pool and timeout settings to the driver', async () => {
    const openUri = vi.spyOn(mongoose.Connection.prototype, 'openUri').mockResolvedValue(undefined as never)
    try {
      const db = createDatabase({
        uri: 'mongodb://127.0.0.1:1/x',
        logger: silentLogger(),
        maxPoolSize: 20,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 0,
      })
      await db.connect()
      expect(openUri).toHaveBeenCalledWith('mongodb://127.0.0.1:1/x', {
        maxPoolSize: 20,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 3000,
        connectTimeoutMS: 8000,
        socketTimeoutMS: 0,
        bufferCommands: false,
      })
    } finally {
      openUri.mockRestore()
    }
  })
})
