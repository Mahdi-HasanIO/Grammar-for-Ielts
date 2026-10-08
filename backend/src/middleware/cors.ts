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
 * Credentials: authentication uses a session cookie, so allowed origins also
 * get Access-Control-Allow-Credentials: true (the browser then sends the
 * cookie with fetch(..., { credentials: 'include' })). Other origins get no
 * CORS headers at all, credentials included. Never combine credentials with
 * "*": the origin is always echoed exactly. CSRF checks are in csrf.ts.
 */
export function corsOptions(allowedOrigins: readonly string[]): CorsOptions {
  const allowed = new Set(allowedOrigins)
  return {
    origin: (origin, callback) => callback(null, origin !== undefined && allowed.has(origin)),
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 600,
  }
}

export function corsMiddleware(allowedOrigins: readonly string[]): RequestHandler {
  return cors(corsOptions(allowedOrigins))
}
