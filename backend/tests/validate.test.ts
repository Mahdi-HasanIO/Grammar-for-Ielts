import express from 'express'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { createErrorHandler } from '../src/middleware/errorHandler.js'
import { getValidated, validate } from '../src/middleware/validate.js'
import { paginationQuery } from '../src/validators/pagination.js'
import { silentLogger } from './helpers.js'

const schemas = {
  params: z.object({ slug: z.string().regex(/^[a-z0-9-]+$/) }),
  query: paginationQuery,
  body: z.object({ note: z.string().min(1).max(20) }),
}

/** A throwaway app: the foundation has no feature routes, so the middleware is exercised here. */
function app() {
  const a = express()
  a.use(express.json())
  a.post('/items/:slug', validate(schemas), (_req, res) => {
    res.json(getValidated<typeof schemas>(res))
  })
  a.use(createErrorHandler({ logger: silentLogger(), exposeStack: false }))
  return a
}

describe('validate middleware', () => {
  it('passes valid input through, coerced and with defaults applied', async () => {
    const res = await request(app()).post('/items/articles?page=2').send({ note: 'hello' })
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ params: { slug: 'articles' }, query: { page: 2, limit: 20 }, body: { note: 'hello' } })
  })

  it('returns 400 validation_error listing each problem and where it is', async () => {
    const res = await request(app()).post('/items/Not%20Valid?page=0&limit=500').send({ note: '' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.message).toBe('Request validation failed')
    const where = res.body.error.details.map((d: { location: string; path: string }) => `${d.location}.${d.path}`).sort()
    expect(where).toEqual(['body.note', 'params.slug', 'query.limit', 'query.page'])
  })

  it('rejects a missing body', async () => {
    const res = await request(app()).post('/items/articles')
    expect(res.status).toBe(400)
    expect(res.body.error.details[0]).toMatchObject({ location: 'body' })
  })
})

describe('paginationQuery', () => {
  it('defaults to page 1, 20 per page', () => {
    expect(paginationQuery.parse({})).toEqual({ page: 1, limit: 20 })
  })

  it.each([{ page: '0' }, { page: '-1' }, { page: '1.5' }, { limit: '101' }, { limit: 'many' }])('rejects %j', (query) => {
    expect(paginationQuery.safeParse(query).success).toBe(false)
  })
})
