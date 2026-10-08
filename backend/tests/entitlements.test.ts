import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { PLAN_RANK, planLimitsFromEnv } from '../src/config/plans.js'
import { createErrorHandler } from '../src/middleware/errorHandler.js'
import { requireAuth } from '../src/middleware/requireAuth.js'
import { requirePlan } from '../src/middleware/requirePlan.js'
import { setAdminRole } from '../src/scripts/grant-admin.js'
import { effectivePlan } from '../src/services/entitlements.js'
import { unconfiguredPaymentProvider } from '../src/services/payments.js'
import type { AiProvider } from '../src/services/ai/provider.js'
import { silentLogger, testApp, testServices, type TestServiceOptions } from './helpers.js'
import { get, patch, post, signUp } from './http.js'

const okProvider: AiProvider = { model: 'fake', generate: async () => ({ text: JSON.stringify({ isCorrect: true, corrected: 'x', explanation: 'y', mistakes: [] }), usage: { promptTokens: 0, outputTokens: 0, totalTokens: 0 } }) }

async function setup(options: TestServiceOptions = {}) {
  let now = new Date('2026-06-01T12:00:00Z')
  const services = testServices({ now: () => now, ...options })
  const app = testApp(services)
  const learner = await signUp(app, 'learner@example.com')
  const admin = await signUp(app, 'admin@example.com')
  await setAdminRole(services.repositories, 'admin@example.com', true)
  const learnerId = (await services.repositories.users.findByEmail('learner@example.com'))!.id
  const putPlan = (body: object, token = admin, id = learnerId) =>
    request(app).put(`/api/admin/users/${id}/plan`).set('Content-Type', 'application/json').set('Cookie', `gfi_session=${token}`).send(body)
  return { app, services, learner, admin, learnerId, putPlan, advance: (ms: number) => (now = new Date(now.getTime() + ms)) }
}

describe('GET /api/entitlements', () => {
  it('needs a session', async () => {
    expect((await get(testApp(), '/api/entitlements')).status).toBe(401)
  })

  it('shows the free plan, its limits and today\'s usage', async () => {
    const { app, learner } = await setup()
    expect((await get(app, '/api/entitlements', learner)).body).toEqual({
      plan: 'free',
      planExpiresAt: null,
      limits: { aiDailyRequests: 20 },
      usage: { aiRequests: { used: 0, limit: 20, resetsAt: '2026-06-02T00:00:00.000Z' } },
    })
  })
})

describe('admin plan grants', () => {
  it('an admin grants premium until a date; limits, /me and the AI quota follow; it is audited', async () => {
    const ctx = await setup({ aiProvider: okProvider, aiDailyQuota: 1, aiDailyQuotaPremium: 3 })
    const res = await ctx.putPlan({ plan: 'premium', expiresAt: '2026-07-01T00:00:00Z' })
    expect(res.status).toBe(200)
    expect(res.body.user).toMatchObject({ email: 'learner@example.com', plan: 'premium', planExpiresAt: '2026-07-01T00:00:00.000Z' })
    expect(res.text).not.toMatch(/passwordHash|\$argon2/)

    expect((await get(ctx.app, '/api/auth/me', ctx.learner)).body.user.plan).toBe('premium')
    const summary = (await get(ctx.app, '/api/entitlements', ctx.learner)).body
    expect(summary).toMatchObject({ plan: 'premium', limits: { aiDailyRequests: 3 } })
    for (let i = 0; i < 3; i++) expect((await post(ctx.app, '/api/ai/check-sentence', { sentence: 'a' }, ctx.learner)).status).toBe(200)
    expect((await post(ctx.app, '/api/ai/check-sentence', { sentence: 'a' }, ctx.learner)).status).toBe(429)

    const entry = (await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries.find((e: { action: string }) => e.action === 'grant_plan')
    expect(entry).toMatchObject({ action: 'grant_plan', target: { collection: 'users', key: ctx.learnerId }, before: { plan: 'free' }, after: { plan: 'premium' } })
  })

  it('a premium plan past its end date counts as free', async () => {
    const ctx = await setup()
    await ctx.putPlan({ plan: 'premium', expiresAt: '2026-06-01T13:00:00Z' })
    expect((await get(ctx.app, '/api/entitlements', ctx.learner)).body.plan).toBe('premium')
    ctx.advance(60 * 60 * 1000)
    const summary = (await get(ctx.app, '/api/entitlements', ctx.learner)).body
    expect(summary).toMatchObject({ plan: 'free', planExpiresAt: null, limits: { aiDailyRequests: 20 } })
  })

  it('premium without an end date, then back to free', async () => {
    const ctx = await setup()
    expect((await ctx.putPlan({ plan: 'premium' })).body.user.planExpiresAt).toBeNull()
    expect((await ctx.putPlan({ plan: 'free', expiresAt: '2027-01-01T00:00:00Z' })).body.user).toMatchObject({ plan: 'free', planExpiresAt: null })
  })

  it('finds a user by email for the grant', async () => {
    const ctx = await setup()
    const res = await get(ctx.app, '/api/admin/users?email=LEARNER@example.com', ctx.admin)
    expect(res.body.user).toMatchObject({ id: ctx.learnerId, plan: 'free' })
    expect((await get(ctx.app, '/api/admin/users?email=nobody@example.com', ctx.admin)).status).toBe(404)
  })

  it.each([
    ['an unknown plan', { plan: 'gold' }, 400],
    ['an end date in the past', { plan: 'premium', expiresAt: '2026-01-01T00:00:00Z' }, 400],
    ['an unknown field', { plan: 'premium', price: 0 }, 400],
  ])('rejects %s', async (_name, body, status) => {
    const ctx = await setup()
    expect((await ctx.putPlan(body)).status).toBe(status)
  })

  it('404 for an unknown user', async () => {
    const ctx = await setup()
    expect((await ctx.putPlan({ plan: 'premium' }, ctx.admin, 'no-such-user')).status).toBe(404)
  })

  it('only admins can grant: anonymous 401, learner 403, and never self-service', async () => {
    const ctx = await setup()
    expect((await request(ctx.app).put(`/api/admin/users/${ctx.learnerId}/plan`).set('Content-Type', 'application/json').send({ plan: 'premium' })).status).toBe(401)
    expect((await ctx.putPlan({ plan: 'premium' }, ctx.learner)).status).toBe(403)
    expect((await get(ctx.app, '/api/admin/users?email=learner@example.com', ctx.learner)).status).toBe(403)
    expect((await patch(ctx.app, '/api/profile', { plan: 'premium' }, ctx.learner)).status).toBe(400)
    expect((await get(ctx.app, '/api/auth/me', ctx.learner)).body.user.plan).toBe('free')
  })

  it('needs JSON from an allowed origin', async () => {
    const ctx = await setup()
    expect((await ctx.putPlan({ plan: 'premium' }).set('Origin', 'https://evil.example.com')).status).toBe(403)
  })
})

describe('requirePlan', () => {
  async function gated() {
    let now = new Date('2026-06-01T00:00:00Z')
    const services = testServices({ now: () => now })
    const app = express()
    app.get('/premium-feature', requireAuth(services.auth, { name: 'gfi_session', secure: false }), requirePlan('premium', () => now), (_req, res) => {
      res.json({ ok: true })
    })
    app.use(createErrorHandler({ logger: silentLogger(), exposeStack: false }))
    const session = await services.auth.register('learner@example.com', 'correct horse battery')
    const call = () => request(app).get('/premium-feature').set('Cookie', `gfi_session=${session.token}`)
    return { services, userId: session.user.id, call, setNow: (d: Date) => (now = d) }
  }

  it('403 plan_required for a free user, 200 for premium, 403 again once it expires', async () => {
    const ctx = await gated()
    const denied = await ctx.call()
    expect(denied.status).toBe(403)
    expect(denied.body.error).toMatchObject({ code: 'plan_required', message: 'This feature needs the premium plan', details: { required: 'premium' } })
    await ctx.services.repositories.users.update(ctx.userId, { plan: 'premium', planExpiresAt: new Date('2026-06-02T00:00:00Z') })
    expect((await ctx.call()).status).toBe(200)
    ctx.setNow(new Date('2026-06-02T00:00:00Z'))
    expect((await ctx.call()).status).toBe(403)
  })
})

describe('plan helpers and limits config', () => {
  it('effectivePlan honours the end date', () => {
    const at = new Date('2026-06-01T00:00:00Z')
    expect(effectivePlan({ plan: 'premium', planExpiresAt: null }, at)).toBe('premium')
    expect(effectivePlan({ plan: 'premium', planExpiresAt: new Date('2026-06-01T00:00:01Z') }, at)).toBe('premium')
    expect(effectivePlan({ plan: 'premium', planExpiresAt: at }, at)).toBe('free')
    expect(effectivePlan({ plan: 'free', planExpiresAt: null }, at)).toBe('free')
  })

  it('limits come from env, and plans are ranked', () => {
    expect(planLimitsFromEnv({ AI_DAILY_QUOTA: 5, AI_DAILY_QUOTA_PREMIUM: 50 })).toEqual({ free: { aiDailyRequests: 5 }, premium: { aiDailyRequests: 50 } })
    expect(PLAN_RANK.premium).toBeGreaterThan(PLAN_RANK.free)
  })
})

describe('payment provider stub', () => {
  it('answers 503 payments_not_configured for everything', async () => {
    const user = (await testServices().auth.register('a@example.com', 'correct horse battery')).user
    await expect(unconfiguredPaymentProvider.createCheckout(user, 'premium')).rejects.toMatchObject({ status: 503, code: 'payments_not_configured' })
    await expect(unconfiguredPaymentProvider.verifyWebhook(Buffer.from('{}'), {})).rejects.toMatchObject({ status: 503 })
  })
})
