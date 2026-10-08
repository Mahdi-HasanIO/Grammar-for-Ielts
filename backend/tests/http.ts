import request, { type Response } from 'supertest'
import type { Express } from 'express'
import { TEST_ENV } from './helpers.js'

/** Shared request helpers for the account and profile tests. */

export const COOKIE = TEST_ENV.SESSION_COOKIE_NAME
export const EMAIL = 'learner@example.com'
export const PASSWORD = 'correct horse battery'
export const NEW_PASSWORD = 'a brand new passphrase'

/** The session Set-Cookie header, if any. */
export function setCookie(res: Response): string | undefined {
  const headers = res.headers['set-cookie'] as unknown as string[] | undefined
  return headers?.find((header) => header.startsWith(`${COOKIE}=`))
}

export function sessionToken(res: Response): string {
  const header = setCookie(res)
  if (!header) throw new Error('no session cookie set')
  return header.slice(COOKIE.length + 1).split(';')[0] ?? ''
}

export const cookieFor = (token: string) => `${COOKIE}=${token}`

/** POST with a JSON body, optionally signed in. */
export function post(app: Express, path: string, body: object = {}, token?: string) {
  const req = request(app).post(path).set('Content-Type', 'application/json')
  return (token ? req.set('Cookie', cookieFor(token)) : req).send(body)
}

export function get(app: Express, path: string, token?: string) {
  const req = request(app).get(path)
  return token ? req.set('Cookie', cookieFor(token)) : req
}

export function patch(app: Express, path: string, body: object, token?: string) {
  const req = request(app).patch(path).set('Content-Type', 'application/json')
  return (token ? req.set('Cookie', cookieFor(token)) : req).send(body)
}

/** Registers and returns the session token. */
export async function signUp(app: Express, email = EMAIL, password = PASSWORD): Promise<string> {
  const res = await post(app, '/api/auth/register', { email, password })
  if (res.status !== 201) throw new Error(`register failed: ${res.status}`)
  return sessionToken(res)
}

export async function signIn(app: Express, email = EMAIL, password = PASSWORD): Promise<string> {
  const res = await post(app, '/api/auth/login', { email, password })
  if (res.status !== 200) throw new Error(`login failed: ${res.status}`)
  return sessionToken(res)
}

export const isSignedIn = async (app: Express, token: string) => (await get(app, '/api/auth/me', token)).status === 200
