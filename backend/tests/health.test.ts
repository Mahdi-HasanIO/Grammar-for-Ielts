import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { fakeDb, testApp } from './helpers.js'

describe('GET /api/health (liveness)', () => {
  it('returns exactly {"status":"ok"} with 200', async () => {
    const res = await request(testApp()).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/^application\/json/)
    expect(res.text).toBe('{"status":"ok"}')
  })

  it('does not touch the database', async () => {
    const db = {
      state: () => {
        throw new Error('liveness must not read the database')
      },
    }
    const res = await request(testApp({ db })).get('/api/health')
    expect(res.status).toBe(200)
  })
})

describe('GET /api/health/ready (readiness)', () => {
  it('returns 503 while the database is disconnected', async () => {
    const res = await request(testApp({ db: fakeDb('disconnected') })).get('/api/health/ready')
    expect(res.status).toBe(503)
    expect(res.body).toEqual({ status: 'unavailable', database: 'disconnected' })
  })

  it('returns 503 while connecting', async () => {
    const res = await request(testApp({ db: fakeDb('connecting') })).get('/api/health/ready')
    expect(res.status).toBe(503)
    expect(res.body.database).toBe('connecting')
  })

  it('returns 200 with the database state when connected', async () => {
    const res = await request(testApp({ db: fakeDb('connected') })).get('/api/health/ready')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', database: 'connected' })
  })
})
