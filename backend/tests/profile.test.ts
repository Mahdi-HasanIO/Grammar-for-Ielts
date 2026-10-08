import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { canonicalTimeZone } from '../src/validators/profile.js'
import { ALLOWED_ORIGIN, mailToken, testApp, testServices } from './helpers.js'
import { EMAIL, get, patch, post, signUp } from './http.js'

const PROFILE_KEYS = ['dailyGoalMinutes', 'displayName', 'email', 'emailVerifiedAt', 'examDate', 'language', 'targetBand', 'timezone']

async function signedIn() {
  const services = testServices()
  const app = testApp(services)
  const token = await signUp(app)
  return { app, token, services }
}

describe('GET /api/profile', () => {
  it('needs a session', async () => {
    const res = await get(testApp(), '/api/profile')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('unauthenticated')
  })

  it('returns exactly the profile fields, email and verification, with null for unset fields', async () => {
    const { app, token } = await signedIn()
    const res = await get(app, '/api/profile', token)
    expect(res.status).toBe(200)
    expect(Object.keys(res.body.profile).sort()).toEqual(PROFILE_KEYS)
    expect(res.body.profile).toEqual({
      email: EMAIL,
      emailVerifiedAt: null,
      displayName: null,
      targetBand: null,
      examDate: null,
      timezone: null,
      dailyGoalMinutes: null,
      language: null,
    })
  })

  it('shows emailVerifiedAt once verified', async () => {
    const { app, token, services } = await signedIn()
    await post(app, '/api/auth/verify-email', { token: await mailToken(services.sent, '/verify-email') })
    expect((await get(app, '/api/profile', token)).body.profile.emailVerifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })
})

describe('PATCH /api/profile', () => {
  it('needs a session', async () => {
    expect((await patch(testApp(), '/api/profile', { displayName: 'Rafi' })).status).toBe(401)
  })

  it('sets every field and returns the updated profile; GET agrees', async () => {
    const { app, token } = await signedIn()
    const body = { displayName: '  Rafi Ahmed ', targetBand: 7.5, examDate: '2026-12-05', timezone: 'Asia/Dhaka', dailyGoalMinutes: 45, language: 'bn' }
    const res = await patch(app, '/api/profile', body, token)
    expect(res.status).toBe(200)
    const expected = { email: EMAIL, emailVerifiedAt: null, ...body, displayName: 'Rafi Ahmed' }
    expect(res.body.profile).toEqual(expected)
    expect((await get(app, '/api/profile', token)).body.profile).toEqual(expected)
  })

  it('changes only the fields sent; null clears a field', async () => {
    const { app, token } = await signedIn()
    await patch(app, '/api/profile', { displayName: 'Rafi', targetBand: 7, examDate: '2026-12-05' }, token)
    const res = await patch(app, '/api/profile', { targetBand: 6.5, examDate: null }, token)
    expect(res.body.profile).toMatchObject({ displayName: 'Rafi', targetBand: 6.5, examDate: null })
  })

  it('stores the canonical time zone spelling', async () => {
    const { app, token } = await signedIn()
    const res = await patch(app, '/api/profile', { timezone: 'asia/dhaka' }, token)
    expect(res.body.profile.timezone).toBe('Asia/Dhaka')
  })

  it.each([
    ['band below 4', { targetBand: 3.5 }, 'targetBand'],
    ['band above 9', { targetBand: 9.5 }, 'targetBand'],
    ['band not in 0.5 steps', { targetBand: 6.25 }, 'targetBand'],
    ['band as a string', { targetBand: '7' }, 'targetBand'],
    ['unknown time zone', { timezone: 'Mars/Phobos' }, 'timezone'],
    ['UTC offset instead of a zone name', { timezone: '+06:00' }, 'timezone'],
    ['empty time zone', { timezone: '' }, 'timezone'],
    ['empty display name', { displayName: '   ' }, 'displayName'],
    ['display name over 50 characters', { displayName: 'x'.repeat(51) }, 'displayName'],
    ['impossible exam date', { examDate: '2026-02-30' }, 'examDate'],
    ['exam date in another format', { examDate: '05/12/2026' }, 'examDate'],
    ['exam date with a time', { examDate: '2026-12-05T10:00:00Z' }, 'examDate'],
    ['daily goal of 0', { dailyGoalMinutes: 0 }, 'dailyGoalMinutes'],
    ['daily goal over 600', { dailyGoalMinutes: 601 }, 'dailyGoalMinutes'],
    ['fractional daily goal', { dailyGoalMinutes: 1.5 }, 'dailyGoalMinutes'],
    ['unsupported language', { language: 'fr' }, 'language'],
  ])('rejects %s', async (_name, body, field) => {
    const { app, token } = await signedIn()
    const res = await patch(app, '/api/profile', body, token)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toContain(field)
  })

  it.each([
    ['an unknown field', { displayName: 'Rafi', favouriteColour: 'blue' }],
    ['email (not editable here)', { email: 'other@example.com' }],
    ['passwordHash', { passwordHash: 'x' }],
    ['emailVerifiedAt', { emailVerifiedAt: '2026-01-01T00:00:00Z' }],
  ])('rejects %s and changes nothing', async (_name, body) => {
    const { app, token } = await signedIn()
    const res = await patch(app, '/api/profile', body, token)
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('validation_error')
    const profile = (await get(app, '/api/profile', token)).body.profile
    expect(profile).toMatchObject({ email: EMAIL, emailVerifiedAt: null, displayName: null })
  })

  it('rejects an empty body', async () => {
    const { app, token } = await signedIn()
    expect((await patch(app, '/api/profile', {}, token)).status).toBe(400)
  })

  it('accepts the boundaries', async () => {
    const { app, token } = await signedIn()
    for (const body of [{ targetBand: 4 }, { targetBand: 9 }, { dailyGoalMinutes: 1 }, { dailyGoalMinutes: 600 }, { displayName: 'x'.repeat(50) }, { language: 'en' }]) {
      expect((await patch(app, '/api/profile', body, token)).status).toBe(200)
    }
  })

  it('rejects a disallowed Origin and a non-JSON body', async () => {
    const { app, token } = await signedIn()
    expect((await patch(app, '/api/profile', { displayName: 'Rafi' }, token).set('Origin', 'https://evil.example.com')).status).toBe(403)
    expect((await patch(app, '/api/profile', { displayName: 'Rafi' }, token).set('Origin', ALLOWED_ORIGIN)).status).toBe(200)
    const form = await request(app).patch('/api/profile').set('Cookie', `gfi_session=${token}`).set('Content-Type', 'application/x-www-form-urlencoded').send('displayName=Rafi')
    expect(form.status).toBe(415)
  })

  it('never returns hashes or tokens', async () => {
    const { app, token } = await signedIn()
    for (const res of [await get(app, '/api/profile', token), await patch(app, '/api/profile', { displayName: 'Rafi' }, token)]) {
      expect(res.text).not.toMatch(/\$argon2|passwordHash|tokenHash/)
      expect(res.text).not.toContain(token)
    }
  })
})

describe('canonicalTimeZone', () => {
  it.each([
    ['Asia/Dhaka', 'Asia/Dhaka'],
    ['europe/london', 'Europe/London'],
    ['UTC', 'UTC'],
    ['America/Argentina/Buenos_Aires', 'America/Argentina/Buenos_Aires'],
    ['Asia/Kolkata', 'Asia/Kolkata'],
  ])('%s -> %s', (input, expected) => {
    expect(canonicalTimeZone(input)).toBe(expected)
  })

  it.each(['Mars/Phobos', '+06:00', 'GMT+6', '', 'Asia/Dhaka; rm -rf'])('rejects %j', (input) => {
    expect(canonicalTimeZone(input)).toBeNull()
  })
})
