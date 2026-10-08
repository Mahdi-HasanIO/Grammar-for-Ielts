import { rateLimit } from 'express-rate-limit'
import type { RequestHandler } from 'express'
import { AppError } from '../utils/AppError.js'

export interface RateLimitOptions {
  windowMs: number
  limit: number
}

/** 300 requests per IP per 15 minutes across the API. */
export const DEFAULT_RATE_LIMIT: RateLimitOptions = { windowMs: 15 * 60 * 1000, limit: 300 }

/**
 * 50 requests per IP per 15 minutes on /api/auth/*, on top of the global limit:
 * slows password guessing and email probing. GET /api/auth/me counts too, so
 * the frontend should call it once per page load, not poll it.
 */
export const AUTH_RATE_LIMIT: RateLimitOptions = { windowMs: 15 * 60 * 1000, limit: 50 }

const HEALTH_PATHS = new Set(['/api/health', '/api/health/ready'])

/**
 * Global per-IP rate limit (in-memory: fine for a single instance; a shared
 * store such as MongoDB or Redis is needed once there are several instances).
 *
 * Health checks are exempt so platform probes are never throttled.
 *
 * Behind a reverse proxy or load balancer the client IP comes from
 * X-Forwarded-For, which Express only trusts when `trust proxy` is set
 * (see createApp). Until the hosting provider is chosen it stays off, so
 * every request is keyed by the direct peer address.
 */
export function rateLimiter({ windowMs, limit }: RateLimitOptions = DEFAULT_RATE_LIMIT): RequestHandler {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => HEALTH_PATHS.has(req.path),
    handler: (_req, _res, next) => next(new AppError(429, 'rate_limited', 'Too many requests, please try again later')),
  })
}

/** The stricter per-IP limit for the auth router. A separate counter from the global one. */
export function authRateLimiter({ windowMs, limit }: RateLimitOptions = AUTH_RATE_LIMIT): RequestHandler {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    identifier: 'auth',
    handler: (_req, _res, next) => next(new AppError(429, 'rate_limited', 'Too many requests, please try again later')),
  })
}
