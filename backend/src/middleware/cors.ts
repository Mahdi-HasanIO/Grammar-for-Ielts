import cors, { type CorsOptions } from 'cors'
import type { RequestHandler } from 'express'

/**
 * CORS allowlist from CORS_ORIGINS (exact origins only).
 *
 * - An allowed origin gets Access-Control-Allow-Origin set to that origin.
 * - Any other origin, or a request with no Origin header (curl, server to
 *   server, same-origin), gets no CORS headers. Browsers then block
 *   cross-origin reads; the request itself is not rejected, because CORS is
 *   enforced by the browser, not the server.
 *
 * Credentials: `credentials` is false because there is no authentication yet.
 * Decide when authentication is designed (Phase 1B):
 * - cookie sessions → credentials: true, exact origins only (never "*"),
 *   cookies with Secure + HttpOnly + SameSite, and CSRF protection;
 * - bearer tokens in the Authorization header → credentials can stay false,
 *   but "Authorization" must be added to allowedHeaders.
 */
export function corsOptions(allowedOrigins: readonly string[]): CorsOptions {
  const allowed = new Set(allowedOrigins)
  return {
    origin: (origin, callback) => callback(null, origin !== undefined && allowed.has(origin)),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: false,
    maxAge: 600,
  }
}

export function corsMiddleware(allowedOrigins: readonly string[]): RequestHandler {
  return cors(corsOptions(allowedOrigins))
}
