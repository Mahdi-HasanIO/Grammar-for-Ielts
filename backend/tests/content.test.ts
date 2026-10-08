import request from 'supertest'
import { beforeAll, describe, expect, it } from 'vitest'
import { contentFromSnapshot, seedContent } from '../src/services/contentSeed.js'
import { readContentSnapshot, testApp, testServices } from './helpers.js'

/** An app whose in-memory content collections hold the seeded snapshot. */
async function seededApp() {
  const services = testServices()
  await seedContent(services.repositories.content, contentFromSnapshot(readContentSnapshot()))
  return testApp(services)
}

let app: Awaited<ReturnType<typeof seededApp>>
beforeAll(async () => {
  app = await seededApp()
})

describe('GET /api/content/modules', () => {
  it('lists the stages and every module in course order, publicly cacheable', async () => {
    const res = await request(app).get('/api/content/modules')
    expect(res.status).toBe(200)
    expect(res.headers['cache-control']).toBe('public, max-age=300')
    expect(res.body.stages.map((s: { id: number }) => s.id)).toEqual([1, 2, 3, 4, 5])
    expect(res.body.modules.map((m: { legacyId: number }) => m.legacyId)).toEqual(Array.from({ length: 24 }, (_, i) => i + 1))
    expect(res.body.modules[0]).toMatchObject({ legacyId: 1, stage: 1, topic: { slug: 'sentence-structure' } })
  })

  it('needs no session', async () => {
    expect((await request(app).get('/api/content/modules').set('Cookie', 'gfi_session=nonsense')).status).toBe(200)
  })

  it('is compressed for clients that accept it', async () => {
    const res = await request(app).get('/api/content/modules').set('Accept-Encoding', 'gzip')
    expect(res.headers['content-encoding']).toBe('gzip')
  })
})

describe('GET /api/content/modules/:ref', () => {
  it.each(['3', 'articles'])('resolves %s (legacy id or topic slug) to the same module', async (ref) => {
    const res = await request(app).get(`/api/content/modules/${ref}`)
    expect(res.status).toBe(200)
    expect(res.body.module.legacyId).toBe(3)
  })

  it('resolves the stable module slug', async () => {
    const { module } = (await request(app).get('/api/content/modules/3')).body
    expect((await request(app).get(`/api/content/modules/${module.slug}`)).body.module.legacyId).toBe(3)
  })

  it.each(['999', 'no-such-module'])('returns 404 for %s', async (ref) => {
    const res = await request(app).get(`/api/content/modules/${ref}`)
    expect(res.status).toBe(404)
    expect(res.body.error).toMatchObject({ code: 'not_found', message: 'Module not found' })
  })
})

describe('lessons and questions', () => {
  it('returns the Bangla lesson by default and English on request', async () => {
    const bn = await request(app).get('/api/content/modules/articles/lesson')
    const en = await request(app).get('/api/content/modules/articles/lesson?language=en')
    expect(bn.body.lesson).toMatchObject({ moduleId: 3, language: 'bn' })
    expect(en.body.lesson).toMatchObject({ moduleId: 3, language: 'en' })
    expect(en.body.lesson.rules.map((r: { id: string }) => r.id)).toEqual(bn.body.lesson.rules.map((r: { id: string }) => r.id))
  })

  it('rejects an unknown language', async () => {
    const res = await request(app).get('/api/content/modules/3/lesson?language=fr')
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('returns a module\'s practice and test sets in order', async () => {
    const practice = (await request(app).get('/api/content/modules/3/questions?set=practice')).body.questions
    const test = (await request(app).get('/api/content/modules/3/questions?set=test')).body.questions
    const all = (await request(app).get('/api/content/modules/3/questions')).body.questions
    expect(practice).toHaveLength(4)
    expect(test).toHaveLength(10)
    expect(all).toHaveLength(14)
    expect(test.map((q: { position: number }) => q.position)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    for (const q of [...practice, ...test]) expect(q.moduleId).toBe(3)
  })

  it('rejects an unknown set', async () => {
    expect((await request(app).get('/api/content/modules/3/questions?set=exam')).status).toBe(400)
  })
})

describe('blog', () => {
  it('lists posts newest first, without bodies', async () => {
    const res = await request(app).get('/api/content/blog')
    expect(res.status).toBe(200)
    expect(res.body.categories).toContain('Grammar Tips')
    const dates = res.body.posts.map((p: { date: string }) => p.date)
    expect(dates).toEqual([...dates].sort().reverse())
    for (const post of res.body.posts) expect(post.body).toBeUndefined()
  })

  it('returns one post with its body', async () => {
    const [first] = (await request(app).get('/api/content/blog')).body.posts
    const res = await request(app).get(`/api/content/blog/${first.slug}`)
    expect(res.body.post.slug).toBe(first.slug)
    expect(res.body.post.body.length).toBeGreaterThan(0)
  })

  it('returns 404 for an unknown post', async () => {
    expect((await request(app).get('/api/content/blog/no-such-post')).status).toBe(404)
  })
})

describe('content API guards', () => {
  it('is read-only: writes are not routed', async () => {
    expect((await request(app).post('/api/content/modules').set('Content-Type', 'application/json').send({})).status).toBe(404)
    expect((await request(app).delete('/api/content/blog/x')).status).toBe(404)
  })

  it('returns 503 while MongoDB is unreachable', async () => {
    const down = testApp({ ...testServices(), db: { state: () => 'disconnected' } })
    expect((await request(down).get('/api/content/modules')).status).toBe(503)
  })

  it('returns empty lists before the database is seeded', async () => {
    const empty = testApp(testServices())
    expect((await request(empty).get('/api/content/modules')).body).toEqual({ stages: [], modules: [] })
  })
})
