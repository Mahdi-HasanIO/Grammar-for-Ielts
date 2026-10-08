import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { JSON_BODY_LIMIT } from '../src/app.js'
import { createErrorHandler, notFound, toAppError } from '../src/middleware/errorHandler.js'
import { AppError } from '../src/utils/AppError.js'
import { capturingLogger, fakeDb, silentLogger, TEST_ENV, testApp } from './helpers.js'
import type { AuthService } from '../src/services/auth.js'

/** An auth service whose session lookup fails with a bug, to produce a logged 500. */
const failingAuth = (): AuthService => ({
  register: async () => Promise.reject(new Error('bug')),
  login: async () => Promise.reject(new Error('bug')),
  logout: async () => undefined,
  authenticate: async () => Promise.reject(new Error('bug')),
})

describe('not found', () => {
  it('returns the JSON 404 shape for an unknown route', async () => {
    const res = await request(testApp()).get('/api/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: { code: 'not_found', message: 'Route not found', requestId: expect.any(String) } })
  })

  it('also covers paths outside /api', async () => {
    const res = await request(testApp()).get('/')
    expect(res.status).toBe(404)
    expect(res.body.error.code).toBe('not_found')
  })
})

describe('request bodies', () => {
  it('returns 400 invalid_json for a malformed JSON body', async () => {
    const res = await request(testApp()).post('/api/health').set('Content-Type', 'application/json').send('{"broken": ')
    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: { code: 'invalid_json', message: 'Request body is not valid JSON', requestId: expect.any(String) } })
  })

  it(`returns 413 payload_too_large for a JSON body over ${JSON_BODY_LIMIT}`, async () => {
    const big = JSON.stringify({ text: 'x'.repeat(200 * 1024) })
    const res = await request(testApp()).post('/api/health').set('Content-Type', 'application/json').send(big)
    expect(res.status).toBe(413)
    expect(res.body).toEqual({ error: { code: 'payload_too_large', message: 'Request body is too large', requestId: expect.any(String) } })
  })
})

/** A minimal app using the same error middleware, with routes that throw. */
function throwingApp(exposeStack: boolean) {
  const app = express()
  app.get('/boom', () => {
    throw new Error('secret internal detail: db password is hunter2')
  })
  app.get('/teapot', () => {
    throw new AppError(418, 'teapot', 'I am a teapot', { details: { reason: 'tea' } })
  })
  app.use(notFound)
  app.use(createErrorHandler({ logger: silentLogger(), exposeStack }))
  return app
}

describe('error responses', () => {
  it('in production, a 500 has the generic shape: no stack, no internal message', async () => {
    const res = await request(throwingApp(false)).get('/boom')
    expect(res.status).toBe(500)
    expect(res.body).toEqual({ error: { code: 'internal_error', message: 'Internal server error' } })
    expect(res.text).not.toMatch(/hunter2|stack|at \w+ \(/)
  })

  it('the real app is configured to hide stacks outside development', async () => {
    const res = await request(testApp({ env: { ...TEST_ENV, NODE_ENV: 'production' } })).get('/missing')
    expect(Object.keys(res.body.error).sort()).toEqual(['code', 'message', 'requestId'])
  })

  it('every error response carries the request id from the X-Request-Id header', async () => {
    const res = await request(testApp()).get('/api/missing')
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/)
    expect(res.body.error.requestId).toBe(res.headers['x-request-id'])
  })

  it('error logs carry the same id as reqId', async () => {
    const { logger, lines } = capturingLogger()
    const app = testApp({ logger, db: fakeDb('connected'), auth: failingAuth() })
    const res = await request(app).get('/api/auth/me').set('Cookie', `gfi_session=${'A'.repeat(43)}`)
    expect(res.status).toBe(500)
    const failure = lines.map((l) => JSON.parse(l)).find((entry) => entry.msg === 'Request failed')
    expect(failure.reqId).toBe(res.headers['x-request-id'])
    expect(failure.req).toBeUndefined()
  })

  it('in development, a 500 includes the stack to help debugging', async () => {
    const res = await request(throwingApp(true)).get('/boom')
    expect(res.status).toBe(500)
    expect(res.body.error.code).toBe('internal_error')
    expect(res.body.error.stack).toMatch(/Error: secret internal detail/)
  })

  it('passes AppError status, code, message and details through', async () => {
    const res = await request(throwingApp(false)).get('/teapot')
    expect(res.status).toBe(418)
    expect(res.body).toEqual({ error: { code: 'teapot', message: 'I am a teapot', details: { reason: 'tea' } } })
  })

  it('maps unknown thrown values to a 500 AppError', () => {
    expect(toAppError('nope')).toMatchObject({ status: 500, code: 'internal_error' })
    expect(toAppError({ status: 404, expose: true })).toMatchObject({ status: 404, code: 'bad_request', message: 'Not Found' })
    expect(toAppError({ status: 503, expose: false })).toMatchObject({ status: 500 })
  })
})
