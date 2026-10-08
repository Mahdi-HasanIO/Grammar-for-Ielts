import { randomUUID } from 'node:crypto'
import { pinoHttp } from 'pino-http'
import type { RequestHandler } from 'express'
import type { Logger } from '../config/logger.js'

/** Health checks are polled by the platform every few seconds; logging them would drown everything else. */
const isHealthCheck = (url: string | undefined) => url === '/api/health' || url?.startsWith('/api/health/') === true

/**
 * One log line per request: id, method, URL, status and duration. Headers
 * (including Authorization and cookies) and bodies are never logged.
 * Each response carries the id in X-Request-Id for support and debugging,
 * and every line logged through req.log carries it as `reqId`.
 */
export function requestLogger(logger: Logger): RequestHandler {
  return pinoHttp({
    logger,
    // req.log lines carry just { reqId }; the full (serialized) request is only on the completion line.
    quietReqLogger: true,
    autoLogging: { ignore: (req) => isHealthCheck(req.url) },
    genReqId: (_req, res) => {
      const id = randomUUID()
      res.setHeader('X-Request-Id', id)
      return id
    },
    serializers: {
      req: (req: { id: unknown; method: string; url: string }) => ({ id: req.id, method: req.method, url: req.url }),
      res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
    },
    customLogLevel: (_req, res, error) => (error || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
  })
}
