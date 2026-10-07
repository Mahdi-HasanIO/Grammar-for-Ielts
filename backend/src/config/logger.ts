import { pino, type Logger } from 'pino'
import type { Env } from './env.js'

export type { Logger }

/** JSON logs to stdout. Pipe through `npx pino-pretty` for readable local output. */
export function createLogger(env: Pick<Env, 'LOG_LEVEL'>, destination?: pino.DestinationStream): Logger {
  return pino(
    {
      level: env.LOG_LEVEL,
      base: { service: 'grammar-for-ielts-api' },
      // Defence in depth: request logs only include id, method, URL and status (see requestLogger),
      // but strip credentials if a header object is ever logged.
      redact: { paths: ['req.headers.authorization', 'req.headers.cookie', 'res.headers["set-cookie"]'], remove: true },
    },
    destination,
  )
}
