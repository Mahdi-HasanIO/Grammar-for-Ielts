import { Router, type RequestHandler } from 'express'
import { z } from 'zod'
import { getValidated, validate } from '../middleware/validate.js'
import type { ContentService } from '../services/content.js'
import { LESSON_LANGUAGES, QUESTION_SETS } from '../validators/content.js'

const ref = z.object({ ref: z.string().min(1).max(100) })
const slugParam = z.object({ slug: z.string().min(1).max(200) })
const lessonQuery = z.object({ language: z.enum(LESSON_LANGUAGES).default('bn') })
const questionsQuery = z.object({ set: z.enum(QUESTION_SETS).optional() })

/** Public, and the same for everyone: browsers and CDNs may cache it for a few minutes. */
const cacheable: RequestHandler = (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300')
  next()
}

/**
 * /api/content: read-only course and blog content from MongoDB (seeded from
 * the static content). Public: the same content already ships in the app.
 */
export function createContentRouter({ content, database }: { content: ContentService; database: RequestHandler }): Router {
  const router = Router()
  router.use(database, cacheable)

  router.get('/modules', async (_req, res) => {
    res.json(await content.catalog())
  })
  router.get('/modules/:ref', validate({ params: ref }), async (_req, res) => {
    res.json({ module: await content.module(getValidated<{ params: typeof ref }>(res).params.ref) })
  })
  router.get('/modules/:ref/lesson', validate({ params: ref, query: lessonQuery }), async (_req, res) => {
    const { params, query } = getValidated<{ params: typeof ref; query: typeof lessonQuery }>(res)
    res.json({ lesson: await content.lesson(params.ref, query.language) })
  })
  router.get('/modules/:ref/questions', validate({ params: ref, query: questionsQuery }), async (_req, res) => {
    const { params, query } = getValidated<{ params: typeof ref; query: typeof questionsQuery }>(res)
    res.json({ questions: await content.questions(params.ref, query.set) })
  })
  router.get('/blog', async (_req, res) => {
    res.json(await content.posts())
  })
  router.get('/blog/:slug', validate({ params: slugParam }), async (_req, res) => {
    res.json({ post: await content.post(getValidated<{ params: typeof slugParam }>(res).params.slug) })
  })
  return router
}
