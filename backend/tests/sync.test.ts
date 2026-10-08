import request from 'supertest'
import { describe, expect, it } from 'vitest'
import type { SyncRepository } from '../src/repositories/types.js'
import { mergeBookmarks, mergeProgress } from '../src/services/merge.js'
import { createSyncService } from '../src/services/sync.js'
import { bookmarkList, BOOKMARK_LIMITS, progressState, type Bookmark, type ProgressState } from '../src/validators/progress.js'
import { testApp, testServices } from './helpers.js'
import { get, post, signUp } from './http.js'

/** A valid progress state in the frontend's version-1 shape. */
function progress(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    schemaVersion: 1,
    modules: {
      '1': { moduleId: 1, completed: true, lessonViewed: true, practiceCompleted: true, bestScore: 90, latestScore: 80, attempts: 2, completedAt: '2026-01-02T10:00:00.000Z' },
    },
    attempts: [{ moduleId: 1, at: '2026-01-02T10:00:00.000Z', score: 8, total: 10, percentage: 80, passed: true }],
    activity: { '2026-01-02': { date: '2026-01-02', minutes: 15, modulesCompleted: 1, testsTaken: 1, questionsAnswered: 10, questionsCorrect: 8 } },
    badges: ['first-steps'],
    xp: 120,
    startedAt: '2026-01-01T09:00:00.000Z',
    ...overrides,
  }
}

const bookmark = (path: string, savedAt = '2026-01-01T00:00:00.000Z', title = path): Bookmark => ({ kind: 'lesson', path, title, savedAt })

function put(app: ReturnType<typeof testApp>, path: '/api/progress' | '/api/bookmarks', body: object, token?: string) {
  const req = request(app).put(path).set('Content-Type', 'application/json')
  return (token ? req.set('Cookie', `gfi_session=${token}`) : req).send(body)
}

async function signedIn() {
  const app = testApp(testServices())
  return { app, token: await signUp(app) }
}

describe('GET/PUT /api/progress', () => {
  it('needs a session', async () => {
    const app = testApp()
    expect((await get(app, '/api/progress')).status).toBe(401)
    expect((await put(app, '/api/progress', { baseVersion: 0, progress: progress() })).status).toBe(401)
  })

  it('starts empty at version 0', async () => {
    const { app, token } = await signedIn()
    const res = await get(app, '/api/progress', token)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ progress: null, version: 0, updatedAt: null })
  })

  it('saves and returns the document, bumping the version on each write', async () => {
    const { app, token } = await signedIn()
    const first = await put(app, '/api/progress', { baseVersion: 0, progress: progress() }, token)
    expect(first.status).toBe(200)
    expect(first.body).toMatchObject({ progress: progress(), version: 1, merged: false })
    expect(first.body.updatedAt).toMatch(/^\d{4}-/)

    const second = await put(app, '/api/progress', { baseVersion: 1, progress: progress({ xp: 200 }) }, token)
    expect(second.body).toMatchObject({ version: 2, merged: false })
    expect((await get(app, '/api/progress', token)).body).toMatchObject({ progress: progress({ xp: 200 }), version: 2 })
  })

  it('an up-to-date write replaces the document (e.g. a deliberate reset)', async () => {
    const { app, token } = await signedIn()
    await put(app, '/api/progress', { baseVersion: 0, progress: progress() }, token)
    const reset = progress({ modules: {}, attempts: [], activity: {}, badges: [], xp: 0 })
    const res = await put(app, '/api/progress', { baseVersion: 1, progress: reset }, token)
    expect(res.body).toMatchObject({ progress: reset, version: 2, merged: false })
  })

  it('a stale write is merged with the saved data, keeping both devices\' progress', async () => {
    const { app, token } = await signedIn()
    await put(app, '/api/progress', { baseVersion: 0, progress: progress() }, token)
    // A second device that never synced (base 0) completed module 2.
    const other = progress({
      modules: { '2': { moduleId: 2, completed: true, lessonViewed: true, practiceCompleted: false, bestScore: 70, latestScore: 70, attempts: 1 } },
      attempts: [{ moduleId: 2, at: '2026-01-03T10:00:00.000Z', score: 7, total: 10, percentage: 70, passed: true }],
      activity: {},
      badges: ['streak-3'],
      xp: 50,
      startedAt: '2026-01-03T09:00:00.000Z',
    })
    const res = await put(app, '/api/progress', { baseVersion: 0, progress: other }, token)
    expect(res.status).toBe(200)
    expect(res.body.merged).toBe(true)
    expect(res.body.version).toBe(2)
    expect(Object.keys(res.body.progress.modules).sort()).toEqual(['1', '2'])
    expect(res.body.progress.attempts).toHaveLength(2)
    expect(res.body.progress.activity['2026-01-02']).toBeDefined()
    expect(res.body.progress.badges).toEqual(['first-steps', 'streak-3'])
    expect(res.body.progress.xp).toBe(120)
    expect(res.body.progress.startedAt).toBe('2026-01-01T09:00:00.000Z')
  })

  it('concurrent first writes from two devices both land', async () => {
    const { app, token } = await signedIn()
    const a = progress({ badges: ['a'] })
    const b = progress({ badges: ['b'] })
    const [ra, rb] = await Promise.all([put(app, '/api/progress', { baseVersion: 0, progress: a }, token), put(app, '/api/progress', { baseVersion: 0, progress: b }, token)])
    expect([ra.status, rb.status]).toEqual([200, 200])
    const saved = (await get(app, '/api/progress', token)).body
    expect(saved.version).toBe(2)
    expect([...saved.progress.badges].sort()).toEqual(['a', 'b'])
  })

  it('keeps each user\'s data separate', async () => {
    const app = testApp(testServices())
    const alice = await signUp(app, 'alice@example.com')
    const bob = await signUp(app, 'bob@example.com')
    await put(app, '/api/progress', { baseVersion: 0, progress: progress({ xp: 999 }) }, alice)
    expect((await get(app, '/api/progress', bob)).body).toEqual({ progress: null, version: 0, updatedAt: null })
  })

  it('drops unknown fields instead of storing them', async () => {
    const { app, token } = await signedIn()
    const res = await put(app, '/api/progress', { baseVersion: 0, progress: { ...progress(), secret: 'x', modules: { '1': { ...progress().modules['1'], extra: true } } } }, token)
    expect(res.status).toBe(200)
    expect(JSON.stringify(res.body)).not.toMatch(/secret|extra/)
  })

  it.each([
    ['a different schema version', { ...progress(), schemaVersion: 2 }, 'progress.schemaVersion'],
    ['a module id that does not match its key', { ...progress(), modules: { '1': { ...progress().modules['1'], moduleId: 2 } } }, 'progress.modules.1.moduleId'],
    ['a non-numeric module key', { ...progress(), modules: { abc: progress().modules['1'] } }, 'progress.modules.abc'],
    ['a score above 100', { ...progress(), modules: { '1': { ...progress().modules['1'], bestScore: 101 } } }, 'progress.modules.1.bestScore'],
    ['an attempt with score > total', { ...progress(), attempts: [{ moduleId: 1, at: '2026-01-02T10:00:00Z', score: 11, total: 10, percentage: 100, passed: true }] }, 'progress.attempts.0.score'],
    ['an invalid timestamp', { ...progress(), startedAt: 'yesterday' }, 'progress.startedAt'],
    ['an activity day that does not match its key', { ...progress(), activity: { '2026-01-02': { ...progress().activity['2026-01-02'], date: '2026-01-03' } } }, 'progress.activity.2026-01-02.date'],
    ['a negative xp', { ...progress(), xp: -1 }, 'progress.xp'],
    ['too many badges', { ...progress(), badges: Array.from({ length: 501 }, (_, i) => `b${i}`) }, 'progress.badges'],
    ['a missing field', (({ attempts: _attempts, ...rest }) => rest)(progress()), 'progress.attempts'],
  ])('rejects %s with 400', async (_name, body, path) => {
    const { app, token } = await signedIn()
    const res = await put(app, '/api/progress', { baseVersion: 0, progress: body }, token)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toContain(path)
  })

  it.each([[{ progress: progress() }], [{ baseVersion: -1, progress: progress() }], [{ baseVersion: 1.5, progress: progress() }]])('requires a whole, non-negative baseVersion', async (body) => {
    const { app, token } = await signedIn()
    expect((await put(app, '/api/progress', body, token)).status).toBe(400)
  })
})

describe('GET/PUT /api/bookmarks', () => {
  it('saves, returns and versions the list', async () => {
    const { app, token } = await signedIn()
    expect((await get(app, '/api/bookmarks', token)).body).toEqual({ bookmarks: null, version: 0, updatedAt: null })
    const res = await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks: [bookmark('/grammar/articles')] }, token)
    expect(res.body).toMatchObject({ bookmarks: [bookmark('/grammar/articles')], version: 1, merged: false })
  })

  it('an up-to-date write can remove a bookmark', async () => {
    const { app, token } = await signedIn()
    await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks: [bookmark('/a'), bookmark('/b')] }, token)
    const res = await put(app, '/api/bookmarks', { baseVersion: 1, bookmarks: [bookmark('/a')] }, token)
    expect(res.body.bookmarks).toEqual([bookmark('/a')])
  })

  it('a stale write is merged; a bookmark removed on the stale device comes back rather than being lost', async () => {
    const { app, token } = await signedIn()
    await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks: [bookmark('/a'), bookmark('/b')] }, token)
    await put(app, '/api/bookmarks', { baseVersion: 1, bookmarks: [bookmark('/a'), bookmark('/b'), bookmark('/c')] }, token)
    const res = await put(app, '/api/bookmarks', { baseVersion: 1, bookmarks: [bookmark('/a')] }, token)
    expect(res.body.merged).toBe(true)
    expect(res.body.bookmarks.map((b: Bookmark) => b.path).sort()).toEqual(['/a', '/b', '/c'])
  })

  it.each([
    ['an absolute URL', [{ ...bookmark('/a'), path: 'https://evil.example.com' }]],
    ['a protocol-relative path', [{ ...bookmark('/a'), path: '//evil.example.com' }]],
    ['an unknown kind', [{ ...bookmark('/a'), kind: 'video' }]],
    ['a duplicate path', [bookmark('/a'), bookmark('/a')]],
    ['an invalid savedAt', [{ ...bookmark('/a'), savedAt: 'later' }]],
    ['too many bookmarks', Array.from({ length: 1001 }, (_, i) => bookmark(`/p${i}`))],
    ['an over-long title', [bookmark('/a', undefined, 'x'.repeat(501))]],
  ])('rejects %s with 400', async (_name, bookmarks) => {
    const { app, token } = await signedIn()
    const res = await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks }, token)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
  })

  it('refuses a merge that would exceed the cap (422) and changes nothing', async () => {
    const { app, token } = await signedIn()
    const serverSide = Array.from({ length: 600 }, (_, i) => bookmark(`/s${i}`))
    const clientSide = Array.from({ length: 600 }, (_, i) => bookmark(`/c${i}`))
    await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks: serverSide }, token)
    const res = await put(app, '/api/bookmarks', { baseVersion: 0, bookmarks: clientSide }, token)
    expect(res.status).toBe(422)
    expect(res.body.error.code).toBe('sync_limit_exceeded')
    const saved = (await get(app, '/api/bookmarks', token)).body
    expect(saved.version).toBe(1)
    expect(saved.bookmarks).toHaveLength(600)
  })
})

describe('sync guards and limits', () => {
  it('rejects a disallowed Origin and a non-JSON body on PUT', async () => {
    const { app, token } = await signedIn()
    expect((await put(app, '/api/progress', { baseVersion: 0, progress: progress() }, token).set('Origin', 'https://evil.example.com')).status).toBe(403)
    const form = await request(app).put('/api/bookmarks').set('Cookie', `gfi_session=${token}`).set('Content-Type', 'text/plain').send('[]')
    expect(form.status).toBe(415)
  })

  it('accepts a progress body above the general 100 kB limit, up to 5 MB', async () => {
    const { app, token } = await signedIn()
    const attempts = Array.from({ length: 3_000 }, (_, i) => ({ moduleId: 1, at: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(), score: 8, total: 10, percentage: 80, passed: true }))
    const body = { baseVersion: 0, progress: progress({ attempts }) }
    expect(JSON.stringify(body).length).toBeGreaterThan(100_000)
    const res = await put(app, '/api/progress', body, token)
    expect(res.status).toBe(200)
    expect(res.body.progress.attempts).toHaveLength(3_000)
  })

  it('still applies 100 kB to other routes, and 5 MB to progress', async () => {
    const { app, token } = await signedIn()
    const big = 'x'.repeat(150_000)
    expect((await post(app, '/api/auth/login', { email: 'a@example.com', password: big })).status).toBe(413)
    const huge = { baseVersion: 0, progress: { ...progress(), padding: 'x'.repeat(5 * 1024 * 1024) } }
    expect((await put(app, '/api/progress', huge, token)).status).toBe(413)
  })

  it('returns 503 while MongoDB is unreachable', async () => {
    const app = testApp({ ...testServices(), db: { state: () => 'disconnected' } })
    expect((await get(app, '/api/progress')).status).toBe(503)
    expect((await get(app, '/api/bookmarks')).status).toBe(503)
  })

  it('gives up with 409 when other writes keep winning the race', async () => {
    const stuck: SyncRepository<Bookmark[]> = { get: async () => ({ userId: 'u', version: 1, data: [], updatedAt: new Date() }), put: async () => null }
    const service = createSyncService({ repository: stuck, merge: mergeBookmarks, schema: bookmarkList })
    await expect(service.put('u', 1, [])).rejects.toMatchObject({ status: 409, code: 'sync_conflict' })
  })
})

describe('mergeProgress', () => {
  const base = progress()

  it('moves module progress forward only', () => {
    const server = progress({ modules: { '1': { moduleId: 1, completed: true, lessonViewed: true, practiceCompleted: false, bestScore: 90, latestScore: 60, attempts: 5, completedAt: '2026-01-05T00:00:00.000Z' } } })
    const client = progress({ modules: { '1': { moduleId: 1, completed: false, lessonViewed: true, practiceCompleted: true, bestScore: 70, latestScore: 70, attempts: 3, completedAt: '2026-01-02T00:00:00.000Z' } } })
    expect(mergeProgress(server, client).modules['1']).toEqual({
      moduleId: 1,
      completed: true,
      lessonViewed: true,
      practiceCompleted: true,
      bestScore: 90,
      latestScore: 60,
      attempts: 5,
      completedAt: '2026-01-02T00:00:00.000Z',
    })
  })

  it('unions attempts without duplicates, oldest first', () => {
    const later = { moduleId: 2, at: '2026-02-01T00:00:00.000Z', score: 5, total: 10, percentage: 50, passed: false }
    const merged = mergeProgress(base, progress({ attempts: [later, ...base.attempts] }))
    expect(merged.attempts).toEqual([...base.attempts, later])
  })

  it('keeps the larger figure per activity field, never summing (no double counting)', () => {
    const client = progress({ activity: { '2026-01-02': { date: '2026-01-02', minutes: 10, modulesCompleted: 2, testsTaken: 0, questionsAnswered: 20, questionsCorrect: 5 } } })
    expect(mergeProgress(base, client).activity['2026-01-02']).toEqual({ date: '2026-01-02', minutes: 15, modulesCompleted: 2, testsTaken: 1, questionsAnswered: 20, questionsCorrect: 8 })
  })

  it('unions badges, keeps the higher xp and the earliest start', () => {
    const merged = mergeProgress(base, progress({ badges: ['x', 'first-steps'], xp: 500, startedAt: '2026-02-01T00:00:00.000Z' }))
    expect(merged.badges).toEqual(['first-steps', 'x'])
    expect(merged.xp).toBe(500)
    expect(merged.startedAt).toBe(base.startedAt)
  })

  it('the result is still a valid progress document', () => {
    expect(progressState.safeParse(mergeProgress(base, progress({ badges: ['y'] }))).success).toBe(true)
  })
})

describe('mergeBookmarks', () => {
  it('keeps every path; for a shared path the later savedAt wins', () => {
    const server = [bookmark('/a', '2026-01-02T00:00:00.000Z', 'server'), bookmark('/b')]
    const client = [bookmark('/a', '2026-01-01T00:00:00.000Z', 'client-old'), bookmark('/c')]
    expect(mergeBookmarks(server, client)).toEqual([bookmark('/a', '2026-01-02T00:00:00.000Z', 'server'), bookmark('/b'), bookmark('/c')])
    expect(mergeBookmarks([bookmark('/a', '2026-01-01T00:00:00.000Z', 'old')], [bookmark('/a', '2026-01-03T00:00:00.000Z', 'new')])[0]?.title).toBe('new')
  })

  it('caps match the frontend', () => {
    expect(BOOKMARK_LIMITS.bookmarks).toBe(1_000)
  })
})
