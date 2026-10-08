import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import { createGeminiProvider, GEMINI_ENDPOINT } from '../src/services/ai/gemini.js'
import { AiProviderError, type AiProvider, type AiRequest } from '../src/services/ai/provider.js'
import { contentFromSnapshot, seedContent } from '../src/services/contentSeed.js'
import { capturingLogger, readContentSnapshot, testApp, testServices, type TestServiceOptions } from './helpers.js'
import { get, post, signUp } from './http.js'

const content = contentFromSnapshot(readContentSnapshot())

/** A provider that answers with whatever the test queues, and records requests. */
function fakeProvider(answers: (string | Error)[] = []) {
  const requests: AiRequest[] = []
  const provider: AiProvider = {
    model: 'fake-model',
    async generate(req) {
      requests.push(req)
      const next = answers.shift() ?? JSON.stringify({ isCorrect: true, corrected: 'ok', explanation: 'Fine.', mistakes: [] })
      if (next instanceof Error) throw next
      return { text: next, usage: { promptTokens: 1, outputTokens: 1, totalTokens: 2 } }
    },
  }
  return { provider, requests }
}

async function setup(options: TestServiceOptions & { aiRateLimit?: { windowMs: number; limit: number } } = {}) {
  const services = testServices(options)
  await seedContent(services.repositories.content, content)
  const app = testApp({ ...services, aiRateLimit: options.aiRateLimit })
  return { app, services, token: await signUp(app) }
}

const CHECK = { isCorrect: false, corrected: 'The data shows a rise.', explanation: 'Data takes a singular verb here.', mistakes: [{ wrong: 'show', right: 'shows', rule: 'Subject-verb agreement' }] }

const mcq = (n: number) => ({ type: 'multiple-choice', question: `Question ${n}: choose ___.`, options: ['a', 'an', 'the', 'no article'], answer: 'the', explanation: 'Specific noun.' })

describe('authorization and configuration', () => {
  it('needs a session (401)', async () => {
    const { app } = await setup({ aiProvider: fakeProvider().provider })
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'Hi.' })).status).toBe(401)
    expect((await get(app, '/api/ai/quota')).status).toBe(401)
  })

  it('answers 503 ai_not_configured without a key, but still reports the quota', async () => {
    const { app, token } = await setup({ aiProvider: null })
    const res = await post(app, '/api/ai/check-sentence', { sentence: 'Hi.' }, token)
    expect(res.status).toBe(503)
    expect(res.body.error.code).toBe('ai_not_configured')
    expect((await get(app, '/api/ai/quota', token)).body).toMatchObject({ configured: false, quota: { used: 0, limit: 20 } })
  })

  it('rejects a disallowed Origin and a non-JSON body', async () => {
    const { app, token } = await setup({ aiProvider: fakeProvider().provider })
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'Hi.' }, token).set('Origin', 'https://evil.example.com')).status).toBe(403)
    expect((await request(app).post('/api/ai/check-sentence').set('Cookie', `gfi_session=${token}`).set('Content-Type', 'text/plain').send('Hi.')).status).toBe(415)
  })
})

describe('POST /api/ai/check-sentence', () => {
  it('returns the model\'s structured check and the quota', async () => {
    const { provider, requests } = fakeProvider([JSON.stringify(CHECK)])
    const { app, token } = await setup({ aiProvider: provider })
    const res = await post(app, '/api/ai/check-sentence', { sentence: 'The data show a rise.', language: 'bn' }, token)
    expect(res.status).toBe(200)
    expect(res.body.result).toEqual(CHECK)
    expect(res.body.quota).toMatchObject({ used: 1, limit: 20 })
    expect(res.body.quota.resetsAt).toMatch(/T00:00:00\.000Z$/)
    expect(requests[0]?.prompt).toBe('<sentence>The data show a rise.</sentence>')
    expect(requests[0]?.system).toContain('Bangla')
    expect(requests[0]?.json).toBe(true)
  })

  it('accepts JSON wrapped in markdown fences', async () => {
    const { app, token } = await setup({ aiProvider: fakeProvider(['```json\n' + JSON.stringify(CHECK) + '\n```']).provider })
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'x' }, token)).body.result).toEqual(CHECK)
  })

  it.each([
    ['an empty sentence', { sentence: '   ' }],
    ['a sentence over 500 characters', { sentence: 'x'.repeat(501) }],
    ['an unknown language', { sentence: 'Hi.', language: 'fr' }],
  ])('rejects %s (400) without calling the model or using quota', async (_name, body) => {
    const { provider, requests } = fakeProvider()
    const { app, token } = await setup({ aiProvider: provider })
    expect((await post(app, '/api/ai/check-sentence', body, token)).status).toBe(400)
    expect(requests).toHaveLength(0)
    expect((await get(app, '/api/ai/quota', token)).body.quota.used).toBe(0)
  })
})

describe('provider failures', () => {
  it.each<[string, Error | string, number, string]>([
    ['busy or timed out', new AiProviderError('unavailable', 'Gemini responded with HTTP 429', 429), 503, 'ai_unavailable'],
    ['blocked by safety', new AiProviderError('blocked', 'Response blocked (SAFETY)'), 422, 'ai_blocked'],
    ['misconfigured key or model', new AiProviderError('failed', 'Gemini responded with HTTP 403', 403), 502, 'ai_failed'],
    ['not JSON', 'Sure! Here is my answer.', 502, 'ai_bad_response'],
    ['JSON of the wrong shape', JSON.stringify({ verdict: 'fine' }), 502, 'ai_bad_response'],
  ])('%s: %i %s, quota given back, nothing leaked', async (_name, answer, status, code) => {
    const { logger, lines } = capturingLogger()
    const { app, token } = await setup({ aiProvider: fakeProvider([answer]).provider, logger })
    const res = await post(app, '/api/ai/check-sentence', { sentence: 'My secret sentence.' }, token)
    expect(res.status).toBe(status)
    expect(res.body.error.code).toBe(code)
    expect(res.text).not.toMatch(/Gemini|HTTP \d|SAFETY|fake-model|Sure!/)
    expect((await get(app, '/api/ai/quota', token)).body.quota.used).toBe(0)
    const warning = lines.map((l) => JSON.parse(l)).find((e) => e.msg === 'AI request failed')
    expect(warning?.ai.model).toBe('fake-model')
    expect(lines.join('\n')).not.toContain('My secret sentence.')
  })
})

describe('quota and rate limit', () => {
  it('stops at the daily quota with 429 ai_quota_exceeded, and resets the next UTC day', async () => {
    let now = new Date('2026-05-01T22:00:00Z')
    const { app, token } = await setup({ aiProvider: fakeProvider().provider, aiDailyQuota: 2, now: () => now })
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, token)).body.quota.used).toBe(1)
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'b' }, token)).body.quota.used).toBe(2)
    const over = await post(app, '/api/ai/check-sentence', { sentence: 'c' }, token)
    expect(over.status).toBe(429)
    expect(over.body.error).toMatchObject({ code: 'ai_quota_exceeded', details: { limit: 2, resetsAt: '2026-05-02T00:00:00.000Z' } })
    now = new Date('2026-05-02T00:00:01Z')
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'd' }, token)).status).toBe(200)
  })

  it('counts quota per user', async () => {
    const { app, token } = await setup({ aiProvider: fakeProvider().provider, aiDailyQuota: 1 })
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, token)).status).toBe(200)
    const other = await signUp(app, 'other@example.com')
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, other)).status).toBe(200)
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, token)).status).toBe(429)
  })

  it('rate limits per user per minute', async () => {
    const { app, token } = await setup({ aiProvider: fakeProvider().provider, aiRateLimit: { windowMs: 60_000, limit: 2 } })
    for (let i = 0; i < 2; i++) expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, token)).status).toBe(200)
    const limited = await post(app, '/api/ai/check-sentence', { sentence: 'a' }, token)
    expect(limited.status).toBe(429)
    expect(limited.body.error.code).toBe('rate_limited')
    expect(limited.headers['ratelimit-policy']).toMatch(/"ai"; q=2; w=60/)
    const other = await signUp(app, 'other@example.com')
    expect((await post(app, '/api/ai/check-sentence', { sentence: 'a' }, other)).status).toBe(200)
  })
})

describe('POST /api/ai/practice', () => {
  it('generates gradable questions for a module from its lesson', async () => {
    const answer = JSON.stringify({ questions: [mcq(1), { type: 'fill-blank', question: 'I saw ___ eagle.', answer: 'an', explanation: 'Vowel sound.' }] })
    const { provider, requests } = fakeProvider([answer])
    const { app, token } = await setup({ aiProvider: provider })
    const res = await post(app, '/api/ai/practice', { module: 'articles', count: 2, avoid: ['Old question?'] }, token)
    expect(res.status).toBe(200)
    expect(res.body.questions).toHaveLength(2)
    for (const q of res.body.questions) expect(q).toMatchObject({ moduleId: 3, source: 'ai', id: expect.stringMatching(/^ai-/) })
    expect(requests[0]?.prompt).toContain('<lesson>')
    expect(requests[0]?.prompt).toContain('Old question?')
    expect(requests[0]?.system).toContain('exactly 2 items')
  })

  it('drops questions the app could not grade, and fails if none are usable', async () => {
    const broken = [{ ...mcq(1), answer: 'not an option' }, { ...mcq(2), options: ['a', 'a', 'the'] }, { type: 'fill-blank', question: 'No blank here.', answer: 'x', explanation: 'y' }]
    const { app, token } = await setup({ aiProvider: fakeProvider([JSON.stringify({ questions: [...broken, mcq(3)] }), JSON.stringify({ questions: broken })]).provider })
    const ok = await post(app, '/api/ai/practice', { module: '3', count: 4 }, token)
    expect(ok.body.questions.map((q: { question: string }) => q.question)).toEqual(['Question 3: choose ___.'])
    const none = await post(app, '/api/ai/practice', { module: '3' }, token)
    expect(none.status).toBe(502)
    expect(none.body.error.code).toBe('ai_bad_response')
  })

  it('returns 404 for an unknown module without using quota', async () => {
    const { provider, requests } = fakeProvider()
    const { app, token } = await setup({ aiProvider: provider })
    expect((await post(app, '/api/ai/practice', { module: 'no-such-module' }, token)).status).toBe(404)
    expect(requests).toHaveLength(0)
    expect((await get(app, '/api/ai/quota', token)).body.quota.used).toBe(0)
  })

  it.each([[{ module: '3', count: 11 }], [{ module: '3', avoid: Array.from({ length: 31 }, () => 'x') }], [{ count: 2 }]])('caps the input: %j is 400', async (body) => {
    const { app, token } = await setup({ aiProvider: fakeProvider().provider })
    expect((await post(app, '/api/ai/practice', body, token)).status).toBe(400)
  })
})

describe('Gemini adapter (mocked fetch)', () => {
  const ok = (body: unknown) => new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json' } })
  const sampleRequest = { system: 'Be brief.', prompt: 'Hello', json: true, maxOutputTokens: 256 }

  it('sends the documented generateContent request with the key in a header, not the URL', async () => {
    const fetch = vi.fn(async () => ok({ candidates: [{ content: { parts: [{ text: '{"a":1}' }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 3, candidatesTokenCount: 4, thoughtsTokenCount: 5, totalTokenCount: 12 } }))
    const provider = createGeminiProvider({ apiKey: 'secret-key', model: 'gemini-3.5-flash-lite', fetch })
    const result = await provider.generate(sampleRequest)
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe(`${GEMINI_ENDPOINT}/gemini-3.5-flash-lite:generateContent`)
    expect(url).not.toContain('secret-key')
    expect(init.headers).toEqual({ 'x-goog-api-key': 'secret-key', 'Content-Type': 'application/json' })
    expect(JSON.parse(String(init.body))).toEqual({
      system_instruction: { parts: [{ text: 'Be brief.' }] },
      contents: [{ role: 'user', parts: [{ text: 'Hello' }] }],
      generationConfig: { maxOutputTokens: 256, thinkingConfig: { thinkingLevel: 'low' }, responseMimeType: 'application/json' },
    })
    expect(result).toEqual({ text: '{"a":1}', usage: { promptTokens: 3, outputTokens: 9, totalTokens: 12 } })
  })

  it('skips thought parts and joins the text parts', async () => {
    const fetch = vi.fn(async () => ok({ candidates: [{ content: { parts: [{ text: 'thinking…', thought: true }, { text: 'Hel' }, { text: 'lo' }] }, finishReason: 'STOP' }] }))
    expect((await createGeminiProvider({ apiKey: 'k', model: 'm', fetch }).generate(sampleRequest)).text).toBe('Hello')
  })

  it.each<[string, () => Promise<Response>, string, number | undefined]>([
    ['HTTP 429', async () => new Response('{"error":{"message":"quota for key secret-key"}}', { status: 429 }), 'unavailable', 429],
    ['HTTP 503', async () => new Response('busy', { status: 503 }), 'unavailable', 503],
    ['HTTP 400 (bad model)', async () => new Response('{"error":{"message":"model not found"}}', { status: 404 }), 'failed', 404],
    ['a blocked prompt', async () => ok({ promptFeedback: { blockReason: 'SAFETY' } }), 'blocked', undefined],
    ['a blocked response', async () => ok({ candidates: [{ finishReason: 'PROHIBITED_CONTENT' }] }), 'blocked', undefined],
    ['a cut-off response', async () => ok({ candidates: [{ content: { parts: [{ text: '{"a"' }] }, finishReason: 'MAX_TOKENS' }] }), 'bad_response', undefined],
    ['an empty response', async () => ok({ candidates: [{ content: { parts: [] }, finishReason: 'STOP' }] }), 'bad_response', undefined],
    ['a non-JSON body', async () => new Response('<html>', { status: 200 }), 'bad_response', 200],
  ])('maps %s to %s, keeping the provider body out of the error', async (_name, respond, kind, status) => {
    const provider = createGeminiProvider({ apiKey: 'secret-key', model: 'm', fetch: vi.fn(respond) })
    const error = await provider.generate(sampleRequest).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(AiProviderError)
    expect(error).toMatchObject({ kind, providerStatus: status })
    expect((error as Error).message).not.toMatch(/secret-key|model not found|quota for key/)
  })

  it('maps a network failure and a timeout to unavailable', async () => {
    const down = createGeminiProvider({ apiKey: 'k', model: 'm', fetch: vi.fn(async () => Promise.reject(new TypeError('fetch failed'))) })
    await expect(down.generate(sampleRequest)).rejects.toMatchObject({ kind: 'unavailable' })
    const slow = createGeminiProvider({
      apiKey: 'k',
      model: 'm',
      timeoutMs: 20,
      fetch: vi.fn((_url: string | URL | Request, init?: RequestInit) => new Promise<Response>((_resolve, reject) => init?.signal?.addEventListener('abort', () => reject(init.signal?.reason)))),
    })
    await expect(slow.generate(sampleRequest)).rejects.toMatchObject({ kind: 'unavailable', message: 'Gemini request timed out' })
  })
})
