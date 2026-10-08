import type { RequestHandler } from 'express'
import { AppError } from '../utils/AppError.js'

const isJson = (contentType: string | undefined) => contentType?.split(';')[0]?.trim().toLowerCase() === 'application/json'

/**
 * CSRF protection for state-changing routes that rely on the session cookie,
 * on top of SameSite=Lax:
 *
 * - Content-Type must be application/json. HTML forms can only send
 *   urlencoded, multipart or text/plain, and a cross-origin fetch with JSON
 *   needs a CORS preflight, which only allowlisted origins pass.
 * - If the browser sends an Origin header, it must be in CORS_ORIGINS
 *   (an "Origin: null" from sandboxed frames is rejected too). Requests
 *   without Origin (curl, server to server) are allowed: they carry no
 *   ambient browser cookies.
 */
export function csrfProtection(allowedOrigins: readonly string[]): RequestHandler {
  const allowed = new Set(allowedOrigins)
  return (req, _res, next) => {
    const origin = req.headers.origin
    if (origin !== undefined && !allowed.has(origin)) {
      next(new AppError(403, 'origin_not_allowed', 'Request origin is not allowed'))
      return
    }
    if (!isJson(req.headers['content-type'])) {
      next(new AppError(415, 'unsupported_media_type', 'Content-Type must be application/json'))
      return
    }
    next()
  }
}
