import { Router, type RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated, validate } from '../middleware/validate.js'
import type { RateLimitOptions } from '../middleware/rateLimit.js'
import { AI_LIMITS, type AiService } from '../services/ai/service.js'
import { AppError } from '../utils/AppError.js'

const language = z.enum(['en', 'bn']).default('en')
const checkSentenceBody = z.object({
  sentence: z.string('sentence is required').trim().min(1, 'sentence is required').max(AI_LIMITS.sentenceLength, `sentence must be at most ${AI_LIMITS.sentenceLength} characters`),
  language,
})
const practiceBody = z.object({
  module: z.string('module is required').min(1).max(100),
  count: z.number().int().min(1).max(AI_LIMITS.practiceCount).default(5),
  language,
  avoid: z.array(z.string().max(AI_LIMITS.avoidItemLength)).max(AI_LIMITS.avoidItems).default([]),
})

/** 10 requests per minute per signed-in user by default (AI_RATE_LIMIT_PER_MINUTE), on top of the daily quota. */
export const DEFAULT_AI_RATE_LIMIT: RateLimitOptions = { windowMs: 60_000, limit: 10 }

export interface AiRouteGuards {
  database: RequestHandler
  csrf: RequestHandler
  signedIn: RequestHandler
}

/** /api/ai: server-side AI with the server's key. Signed in; 503 when no key is configured. */
export function createAiRouter({ ai, guards: { database, csrf, signedIn }, rateLimit: limits = DEFAULT_AI_RATE_LIMIT }: { ai: AiService; guards: AiRouteGuards; rateLimit?: RateLimitOptions }): Router {
  const router = Router()
  router.use(database, signedIn)

  router.get('/quota', async (_req, res) => {
    res.json({ configured: ai.configured, quota: await ai.quota(getAuth(res).user) })
  })

  router.use((_req, _res, next) => {
    next(ai.configured ? undefined : new AppError(503, 'ai_not_configured', 'AI features are not available on this server'))
  })
  router.use(
    rateLimit({
      ...limits,
      standardHeaders: 'draft-8',
      legacyHeaders: false,
      identifier: 'ai',
      // Per account, not per IP: signed in is required above.
      keyGenerator: (_req, res) => getAuth(res).user.id,
      handler: (_req, _res, next) => next(new AppError(429, 'rate_limited', 'Too many requests, please try again later')),
    }),
  )

  router.post('/check-sentence', csrf, validate({ body: checkSentenceBody }), async (_req, res) => {
    const { body } = getValidated<{ body: typeof checkSentenceBody }>(res)
    res.json(await ai.checkSentence(getAuth(res).user, body))
  })

  router.post('/practice', csrf, validate({ body: practiceBody }), async (_req, res) => {
    const { body } = getValidated<{ body: typeof practiceBody }>(res)
    res.json(await ai.practice(getAuth(res).user, body))
  })
  return router
}
