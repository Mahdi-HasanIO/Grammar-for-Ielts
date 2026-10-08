import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAdminRole } from '../src/scripts/grant-admin.js'
import { contentFromSnapshot, seedContent } from '../src/services/contentSeed.js'
import { mailToken, readContentSnapshot, testApp, testServices } from './helpers.js'
import { get, patch, post, signUp } from './http.js'

const content = contentFromSnapshot(readContentSnapshot())

/** Seeded content, a learner, and an admin granted by the script. */
async function setup(options: { adminEmails?: string[] } = {}) {
  const services = testServices(options)
  await seedContent(services.repositories.content, content)
  const app = testApp(services)
  const learner = await signUp(app, 'learner@example.com')
  const admin = await signUp(app, 'admin@example.com')
  await setAdminRole(services.repositories, 'admin@example.com', true)
  return { app, services, learner, admin }
}

const put = (app: ReturnType<typeof testApp>, path: string, body: unknown, token?: string) => {
  const req = request(app).put(path).set('Content-Type', 'application/json')
  return (token ? req.set('Cookie', `gfi_session=${token}`) : req).send(body as object)
}
const del = (app: ReturnType<typeof testApp>, path: string, token?: string) => {
  const req = request(app).delete(path).set('Content-Type', 'application/json')
  return token ? req.set('Cookie', `gfi_session=${token}`) : req
}

const question = () => structuredClone(content.questions.find((q) => q.id === content.questions.find((x) => x.moduleId === 3 && x.set === 'test')?.id)!)

let ctx: Awaited<ReturnType<typeof setup>>
beforeEach(async () => {
  ctx = await setup()
})

describe('authorization', () => {
  const routes: [string, (token?: string) => request.Test][] = [
    ['GET list', (t) => get(ctx.app, '/api/admin/content/modules', t)],
    ['GET one', (t) => get(ctx.app, '/api/admin/content/modules/3', t)],
    ['PUT', (t) => put(ctx.app, '/api/admin/content/questions/x', {}, t)],
    ['DELETE', (t) => del(ctx.app, '/api/admin/content/questions/x', t)],
    ['GET audit', (t) => get(ctx.app, '/api/admin/audit', t)],
  ]

  it.each(routes)('%s: anonymous 401, learner 403', async (_name, send) => {
    const anonymous = await send()
    expect(anonymous.status).toBe(401)
    expect(anonymous.body.error.code).toBe('unauthenticated')
    const learner = await send(ctx.learner)
    expect(learner.status).toBe(403)
    expect(learner.body.error).toMatchObject({ code: 'forbidden', message: 'Admin access required' })
  })

  it('an admin granted by the script gets in, and loses access as soon as it is revoked', async () => {
    expect((await get(ctx.app, '/api/admin/content/modules', ctx.admin)).status).toBe(200)
    expect((await get(ctx.app, '/api/auth/me', ctx.admin)).body.user.role).toBe('admin')
    await setAdminRole(ctx.services.repositories, 'admin@example.com', false)
    expect((await get(ctx.app, '/api/admin/content/modules', ctx.admin)).status).toBe(403)
  })

  it('ADMIN_EMAILS makes an address admin only once it is verified', async () => {
    const local = await setup({ adminEmails: ['owner@example.com'] })
    const owner = await signUp(local.app, 'owner@example.com')
    expect((await get(local.app, '/api/admin/content/modules', owner)).status).toBe(403)
    expect((await get(local.app, '/api/auth/me', owner)).body.user.role).toBe('user')
    await post(local.app, '/api/auth/verify-email', { token: await mailToken(local.services.sent, '/verify-email') })
    expect((await get(local.app, '/api/admin/content/modules', owner)).status).toBe(200)
    expect((await get(local.app, '/api/auth/me', owner)).body.user.role).toBe('admin')
  })

  it('there is no self-service way to become admin', async () => {
    const res = await patch(ctx.app, '/api/profile', { role: 'admin' }, ctx.learner)
    expect(res.status).toBe(400)
    expect((await post(ctx.app, '/api/admin/users', { email: 'learner@example.com', role: 'admin' }, ctx.learner)).status).toBe(403)
    expect((await get(ctx.app, '/api/auth/me', ctx.learner)).body.user.role).toBe('user')
  })
})

describe('admin content CRUD', () => {
  it('lists and reads documents by key', async () => {
    expect((await get(ctx.app, '/api/admin/content/modules', ctx.admin)).body.documents).toHaveLength(24)
    expect((await get(ctx.app, '/api/admin/content/lessons/3-en', ctx.admin)).body.document).toMatchObject({ moduleId: 3, language: 'en' })
    expect((await get(ctx.app, '/api/admin/content/posts/' + content.posts[0]!.slug, ctx.admin)).body.document.slug).toBe(content.posts[0]!.slug)
  })

  it.each(['/api/admin/content/modules/999', '/api/admin/content/lessons/3-fr', '/api/admin/content/questions/no such id'])('returns 404 for %s', async (path) => {
    expect((await get(ctx.app, path, ctx.admin)).status).toBe(404)
  })

  it('rejects an unknown collection', async () => {
    expect((await get(ctx.app, '/api/admin/content/users', ctx.admin)).status).toBe(400)
  })

  it('updates a question; the public content API and the audit log reflect it', async () => {
    const q = { ...question(), explanation: 'A clearer explanation.' }
    const res = await put(ctx.app, `/api/admin/content/questions/${q.id}`, q, ctx.admin)
    expect(res.status).toBe(200)
    const live = (await get(ctx.app, '/api/content/modules/3/questions?set=test')).body.questions.find((x: { id: string }) => x.id === q.id)
    expect(live.explanation).toBe('A clearer explanation.')
    const [entry] = (await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries
    expect(entry).toMatchObject({ action: 'update', target: { collection: 'questions', key: q.id }, actor: { type: 'user', email: 'admin@example.com' } })
    expect(entry.before.explanation).toBe(question().explanation)
    expect(entry.after.explanation).toBe('A clearer explanation.')
  })

  it('creates a document with 201 and records it', async () => {
    const q = { ...question(), id: 'admin-added-1', position: 10 }
    expect((await put(ctx.app, '/api/admin/content/questions/admin-added-1', q, ctx.admin)).status).toBe(201)
    const [entry] = (await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries
    expect(entry).toMatchObject({ action: 'create', before: null })
  })

  it('an identical write changes nothing and is not audited', async () => {
    const q = question()
    expect((await put(ctx.app, `/api/admin/content/questions/${q.id}`, q, ctx.admin)).status).toBe(200)
    // Only the setup's role grant is in the log.
    expect((await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries.map((e: { action: string }) => e.action)).toEqual(['grant_role'])
  })

  it('validates documents like the seed: 400 for a bad document', async () => {
    const res = await put(ctx.app, `/api/admin/content/questions/${question().id}`, { ...question(), answer: 'not an option' }, ctx.admin)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.details.map((d: { message: string }) => d.message)).toContain('the answer must be exactly one of the options')
  })

  it('rejects a key that does not match the document', async () => {
    const res = await put(ctx.app, '/api/admin/content/questions/other-id', question(), ctx.admin)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('key_mismatch')
  })

  it('checks references: 422 for a question of an unknown module, a post with an unknown topic, a misnumbered rule', async () => {
    const q = { ...question(), moduleId: 999 }
    const badQuestion = await put(ctx.app, `/api/admin/content/questions/${q.id}`, q, ctx.admin)
    expect(badQuestion.status).toBe(422)
    expect(badQuestion.body.error.details).toEqual([{ path: 'moduleId', message: 'module 999 does not exist' }])

    const blogPost = { ...content.posts[0]!, topics: ['ghost'] }
    expect((await put(ctx.app, `/api/admin/content/posts/${blogPost.slug}`, blogPost, ctx.admin)).status).toBe(422)

    const lesson = structuredClone(content.lessons.find((l) => l.moduleId === 3 && l.language === 'en')!)
    lesson.rules[0]!.id = 'm4-wrong'
    expect((await put(ctx.app, '/api/admin/content/lessons/3-en', lesson, ctx.admin)).status).toBe(422)
  })

  it('never changes a stored slug (422) and refuses a duplicate slug (409)', async () => {
    const renamed = { ...content.modules[2]!, slug: 'renamed' }
    const res = await put(ctx.app, `/api/admin/content/modules/${renamed.legacyId}`, renamed, ctx.admin)
    expect(res.status).toBe(422)
    expect(res.body.error.details[0].message).toMatch(/slugs never change/)

    const clash = { ...content.modules[0]!, legacyId: 25, topic: { ...content.modules[0]!.topic, slug: 'brand-new-topic', related: [] } }
    const duplicate = await put(ctx.app, '/api/admin/content/modules/25', clash, ctx.admin)
    expect(duplicate.status).toBe(409)
    expect(duplicate.body.error.code).toBe('duplicate')
  })

  it('deletes a question (204, audited), but not a module that is still in use (409)', async () => {
    const id = question().id
    expect((await del(ctx.app, `/api/admin/content/questions/${id}`, ctx.admin)).status).toBe(204)
    expect((await get(ctx.app, `/api/admin/content/questions/${id}`, ctx.admin)).status).toBe(404)
    expect((await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries[0]).toMatchObject({ action: 'delete', after: null })

    const inUse = await del(ctx.app, '/api/admin/content/modules/3', ctx.admin)
    expect(inUse.status).toBe(409)
    expect(inUse.body.error.code).toBe('in_use')
    expect((await del(ctx.app, '/api/admin/content/questions/never-existed', ctx.admin)).status).toBe(404)
  })

  it('writes need JSON from an allowed origin', async () => {
    expect((await put(ctx.app, `/api/admin/content/questions/${question().id}`, question(), ctx.admin).set('Origin', 'https://evil.example.com')).status).toBe(403)
    const noJson = await request(ctx.app).delete(`/api/admin/content/questions/${question().id}`).set('Cookie', `gfi_session=${ctx.admin}`)
    expect(noJson.status).toBe(415)
  })
})

describe('audit log', () => {
  it('lists newest first, with a limit and paging by time', async () => {
    for (const explanation of ['one', 'two', 'three']) {
      await put(ctx.app, `/api/admin/content/questions/${question().id}`, { ...question(), explanation }, ctx.admin)
      await new Promise((resolve) => setTimeout(resolve, 5))
    }
    const all = (await get(ctx.app, '/api/admin/audit', ctx.admin)).body.entries
    expect(all.map((e: { after: { explanation?: string; role?: string } }) => e.after.explanation ?? e.after.role)).toEqual(['three', 'two', 'one', 'admin'])
    const firstPage = (await get(ctx.app, '/api/admin/audit?limit=1', ctx.admin)).body.entries
    expect(firstPage).toHaveLength(1)
    const next = (await get(ctx.app, `/api/admin/audit?limit=2&before=${encodeURIComponent(firstPage[0].at)}`, ctx.admin)).body.entries
    expect(next.map((e: { after: { explanation: string } }) => e.after.explanation)).toEqual(['two', 'one'])
    expect((await get(ctx.app, '/api/admin/audit?limit=500', ctx.admin)).status).toBe(400)
  })
})

describe('grant-admin script', () => {
  it('grants and revokes, is idempotent, and records each change', async () => {
    const services = testServices()
    const app = testApp(services)
    await signUp(app, 'someone@example.com')
    expect(await setAdminRole(services.repositories, ' Someone@Example.com ', true)).toBe('someone@example.com now has the admin role')
    expect(await setAdminRole(services.repositories, 'someone@example.com', true)).toBe('someone@example.com already has the admin role')
    expect(await setAdminRole(services.repositories, 'someone@example.com', false)).toBe('someone@example.com now has the user role')
    const entries = await services.repositories.audit.list({ limit: 10 })
    expect(entries.map((e) => e.action).sort()).toEqual(['grant_role', 'revoke_role'])
    expect(entries[0]?.actor).toEqual({ type: 'script', name: 'grant-admin' })
  })

  it('fails for an unknown email', async () => {
    await expect(setAdminRole(testServices().repositories, 'nobody@example.com', true)).rejects.toThrow('No account with the email nobody@example.com')
  })
})
