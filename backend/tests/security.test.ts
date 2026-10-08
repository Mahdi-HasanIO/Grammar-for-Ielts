import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { ALLOWED_ORIGIN, capturingLogger, fakeDb, testApp } from './helpers.js'

describe('CORS', () => {
  it('sets Access-Control-Allow-Origin and allows credentials for an allowed origin', async () => {
    const res = await request(testApp()).get('/api/health').set('Origin', ALLOWED_ORIGIN)
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN)
    expect(res.headers['access-control-allow-credentials']).toBe('true')
  })

  it('sets no CORS headers, credentials included, for a disallowed origin', async () => {
    const res = await request(testApp()).get('/api/health').set('Origin', 'https://evil.example.com')
    expect(res.headers['access-control-allow-origin']).toBeUndefined()
    expect(res.headers['access-control-allow-credentials']).toBeUndefined()
  })

  it('sets no CORS headers when there is no Origin (curl, server to server)', async () => {
    const res = await request(testApp()).get('/api/health')
    expect(res.headers['access-control-allow-origin']).toBeUndefined()
  })

  it('answers an allowed preflight with the permitted methods and headers', async () => {
    const res = await request(testApp())
      .options('/api/health')
      .set('Origin', ALLOWED_ORIGIN)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type')
    expect(res.status).toBe(204)
    expect(res.headers['access-control-allow-origin']).toBe(ALLOWED_ORIGIN)
    expect(res.headers['access-control-allow-methods']).toContain('POST')
    expect(res.headers['access-control-allow-headers']).toBe('Content-Type')
  })
})

describe('security headers', () => {
  it('does not advertise Express', async () => {
    const res = await request(testApp()).get('/api/health')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  it('sends helmet headers', async () => {
    const res = await request(testApp()).get('/api/health')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['content-security-policy']).toContain("default-src 'self'")
    expect(res.headers['strict-transport-security']).toBeDefined()
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
  })
})

describe('rate limiting', () => {
  it('returns 429 in the JSON error shape once the limit is reached', async () => {
    const app = testApp({ rateLimit: { windowMs: 60_000, limit: 2 } })
    expect((await request(app).get('/api/anything')).status).toBe(404)
    expect((await request(app).get('/api/anything')).status).toBe(404)
    const limited = await request(app).get('/api/anything')
    expect(limited.status).toBe(429)
    expect(limited.body).toEqual({ error: { code: 'rate_limited', message: 'Too many requests, please try again later' } })
    expect(limited.headers['ratelimit-policy']).toBeDefined()
  })

  it('never throttles health checks', async () => {
    const app = testApp({ rateLimit: { windowMs: 60_000, limit: 1 } })
    for (let i = 0; i < 5; i++) expect((await request(app).get('/api/health')).status).toBe(200)
  })
})

describe('request logging', () => {
  it('logs method, URL and status but never headers or bodies', async () => {
    const { logger, lines } = capturingLogger()
    const res = await request(testApp({ logger }))
      .post('/api/notes')
      .set('Authorization', 'Bearer super-secret-token')
      .set('Cookie', 'session=secret-cookie')
      .send({ password: 'secret-password' })
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/)

    const requestLog = lines.map((l) => JSON.parse(l)).find((entry) => entry.req?.url === '/api/notes')
    expect(requestLog).toMatchObject({ req: { method: 'POST', url: '/api/notes' }, res: { statusCode: 404 } })
    expect(requestLog.req.id).toBe(res.headers['x-request-id'])
    const all = lines.join('\n')
    expect(all).not.toMatch(/super-secret-token|secret-cookie|secret-password|authorization|cookie/i)
  })
})

describe('health checks are not request-logged', () => {
  it('skips /api/health and a 503 from /api/health/ready, so probes cannot flood the logs', async () => {
    const { logger, lines } = capturingLogger()
    const app = testApp({ logger, db: fakeDb('disconnected') })
    expect((await request(app).get('/api/health')).status).toBe(200)
    expect((await request(app).get('/api/health/ready')).status).toBe(503)
    expect((await request(app).get('/api/other')).status).toBe(404)
    const urls = lines.map((l) => JSON.parse(l).req?.url).filter(Boolean)
    expect(urls).toEqual(['/api/other'])
  })
})
