import { STATUS_CODES } from 'node:http'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import type { Logger } from '../config/logger.js'
import { isDatabaseUnavailableError } from '../services/database.js'
import { AppError } from '../utils/AppError.js'

/** Every error response has this shape. `details` only for client errors; `stack` only for unexpected errors in development. */
export interface ErrorBody {
  error: { code: string; message: string; details?: unknown; stack?: string }
}

/** Errors raised by express.json() (body-parser) carry a `type` and an HTTP `status`. */
interface HttpLikeError {
  type?: string
  status?: number
  expose?: boolean
}

const BODY_ERRORS: Record<string, { status: number; code: string; message: string }> = {
  'entity.parse.failed': { status: 400, code: 'invalid_json', message: 'Request body is not valid JSON' },
  'entity.too.large': { status: 413, code: 'payload_too_large', message: 'Request body is too large' },
  'encoding.unsupported': { status: 415, code: 'unsupported_encoding', message: 'Unsupported content encoding' },
  'charset.unsupported': { status: 415, code: 'unsupported_charset', message: 'Unsupported charset' },
}

export const serviceUnavailable = (cause?: unknown) =>
  new AppError(503, 'service_unavailable', 'Service temporarily unavailable, please try again shortly', { cause })

/** Maps anything thrown into an AppError. Unknown errors become a generic 500 with no internal details. */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error
  // The connection dropped mid-request (requireDatabase catches the "not connected" case up front).
  if (isDatabaseUnavailableError(error)) return serviceUnavailable(error)
  const http = (typeof error === 'object' && error !== null ? error : {}) as HttpLikeError
  const known = http.type ? BODY_ERRORS[http.type] : undefined
  if (known) return new AppError(known.status, known.code, known.message, { cause: error })
  if (typeof http.status === 'number' && http.status >= 400 && http.status < 500 && http.expose) {
    return new AppError(http.status, 'bad_request', STATUS_CODES[http.status] ?? 'Bad request', { cause: error })
  }
  return new AppError(500, 'internal_error', 'Internal server error', { cause: error })
}

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, 'not_found', 'Route not found'))
}

export function createErrorHandler({ logger, exposeStack }: { logger: Logger; exposeStack: boolean }): ErrorRequestHandler {
  // Express recognises error middleware by its four parameters, so `next` must stay in the signature.
  return (error, req, res, next) => {
    if (res.headersSent) return next(error)
    const appError = toAppError(error)
    const log = req.log ?? logger
    if (appError.status >= 500) log.error({ err: error }, 'Request failed')

    const body: ErrorBody = { error: { code: appError.code, message: appError.message } }
    if (appError.details !== undefined && appError.status < 500) body.error.details = appError.details
    if (exposeStack && appError.status === 500 && error instanceof Error && error.stack) body.error.stack = error.stack
    res.status(appError.status).json(body)
  }
}
