import type { CookieOptions, Request, Response } from 'express'

export interface SessionCookieConfig {
  name: string
  /** Secure flag: on in production (HTTPS only), off for local http:// development. */
  secure: boolean
}

/**
 * httpOnly: not readable from JavaScript. SameSite=Lax: not sent on
 * cross-site POSTs (first CSRF layer; see middleware/csrf.ts for the second).
 */
const baseOptions = ({ secure }: SessionCookieConfig): CookieOptions => ({ httpOnly: true, secure, sameSite: 'lax', path: '/' })

export function setSessionCookie(res: Response, config: SessionCookieConfig, token: string, expiresAt: Date): void {
  res.cookie(config.name, token, { ...baseOptions(config), expires: expiresAt })
}

export function clearSessionCookie(res: Response, config: SessionCookieConfig): void {
  res.clearCookie(config.name, baseOptions(config))
}

/** Reads one cookie from the Cookie header (no cookie-parser needed for a single value). */
export function readSessionCookie(req: Request, { name }: SessionCookieConfig): string | undefined {
  const header = req.headers.cookie
  if (!header) return undefined
  for (const part of header.split(';')) {
    const separator = part.indexOf('=')
    if (separator === -1 || part.slice(0, separator).trim() !== name) continue
    const value = part.slice(separator + 1).trim()
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
  return undefined
}
