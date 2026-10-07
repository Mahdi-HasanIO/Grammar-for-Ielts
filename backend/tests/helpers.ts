import { Writable } from 'node:stream'
import { createApp, type AppDependencies } from '../src/app.js'
import { createLogger } from '../src/config/logger.js'
import type { DatabaseState } from '../src/services/database.js'

export const ALLOWED_ORIGIN = 'https://app.example.com'

/** A database stub with a fixed state: no MongoDB needed. */
export const fakeDb = (state: DatabaseState = 'disconnected') => ({ state: () => state })

export const silentLogger = () => createLogger({ LOG_LEVEL: 'silent' })

/** Builds the real app with test dependencies. */
export function testApp(overrides: Partial<AppDependencies> = {}) {
  return createApp({
    env: { NODE_ENV: 'test', CORS_ORIGINS: [ALLOWED_ORIGIN] },
    db: fakeDb(),
    logger: silentLogger(),
    ...overrides,
  })
}

/** A logger that records every JSON log line, to check what gets logged. */
export function capturingLogger() {
  const lines: string[] = []
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      lines.push(...String(chunk).split('\n').filter(Boolean))
      callback()
    },
  })
  return { logger: createLogger({ LOG_LEVEL: 'info' }, stream), lines }
}
