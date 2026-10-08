import { Writable } from 'node:stream'
import { createApp, type AppDependencies } from '../src/app.js'
import argon2 from 'argon2'
import { createLogger } from '../src/config/logger.js'
import { createMemoryRepositories } from '../src/repositories/memory.js'
import { createAuthService, type AuthServiceOptions } from '../src/services/auth.js'
import type { DatabaseState } from '../src/services/database.js'
import { createArgon2Hasher } from '../src/services/password.js'

export const ALLOWED_ORIGIN = 'https://app.example.com'

/** A database stub with a fixed state: no MongoDB needed. */
export const fakeDb = (state: DatabaseState = 'disconnected') => ({ state: () => state })

export const silentLogger = () => createLogger({ LOG_LEVEL: 'silent' })

/** Real argon2id with minimal cost, so tests stay fast. Production parameters are tested in password.test.ts. */
export const fastHasher = () => createArgon2Hasher({ type: argon2.argon2id, memoryCost: 1024, timeCost: 1, parallelism: 1 })

/** An auth service over in-memory repositories: no MongoDB needed. */
export function testAuth(overrides: Partial<AuthServiceOptions> = {}) {
  const repositories = overrides.repositories ?? createMemoryRepositories()
  return { repositories, auth: createAuthService({ repositories, hasher: fastHasher(), ...overrides }) }
}

export const TEST_ENV: AppDependencies['env'] = { NODE_ENV: 'test', CORS_ORIGINS: [ALLOWED_ORIGIN], SESSION_COOKIE_NAME: 'gfi_session' }

/** Builds the real app with test dependencies. */
export function testApp(overrides: Partial<AppDependencies> = {}) {
  return createApp({
    env: TEST_ENV,
    db: fakeDb(),
    auth: testAuth().auth,
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

/** Swaps the database name in a MongoDB URI, keeping hosts and query options. */
export function withDatabaseName(uri: string, name: string): string {
  const match = /^(mongodb(?:\+srv)?:\/\/[^/?]+)(?:\/[^?]*)?(\?.*)?$/.exec(uri)
  if (!match) throw new Error('MONGODB_URI_TEST is not a mongodb:// or mongodb+srv:// URI')
  return `${match[1]}/${name}${match[2] ?? ''}`
}
