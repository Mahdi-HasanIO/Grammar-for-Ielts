import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createErrorHandler } from '../src/middleware/errorHandler.js'
import { getAuth, requireAuth } from '../src/middleware/requireAuth.js'
import { silentLogger, testAuth } from './helpers.js'

const cookie = { name: 'gfi_session', secure: false }

/** A minimal app with one protected route, as later phases will add them. */
async function protectedApp() {
  const { auth } = testAuth()
  const session = await auth.register('learner@example.com', 'correct horse battery')
  const app = express()
  app.get('/protected', requireAuth(auth, cookie), (_req, res) => {
    const { user } = getAuth(res)
    res.json({ email: user.email, hasHash: 'passwordHash' in user })
  })
  app.get('/unprotected', (_req, res) => {
    res.json({ auth: getAuth(res) })
  })
  app.use(createErrorHandler({ logger: silentLogger(), exposeStack: false }))
  return { app, token: session.token }
}

describe('requireAuth', () => {
  it('attaches the signed-in user for the handler', async () => {
    const { app, token } = await protectedApp()
    const res = await request(app).get('/protected').set('Cookie', `other=1; gfi_session=${token}; another=2`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ email: 'learner@example.com', hasHash: true })
  })

  it('stops the request with 401 when there is no valid session', async () => {
    const { app } = await protectedApp()
    for (const header of [undefined, 'gfi_session=nope', 'other=1']) {
      const req = request(app).get('/protected')
      const res = await (header ? req.set('Cookie', header) : req)
      expect(res.status).toBe(401)
      expect(res.body).toEqual({ error: { code: 'unauthenticated', message: 'Authentication required' } })
    }
  })

  it('getAuth() fails loudly on a route without requireAuth', async () => {
    const { app } = await protectedApp()
    expect((await request(app).get('/unprotected')).status).toBe(500)
  })
})
