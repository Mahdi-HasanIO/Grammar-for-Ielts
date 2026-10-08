import { readFileSync } from 'node:fs'
import { Writable } from 'node:stream'
import { createApp, type AppDependencies } from '../src/app.js'
import argon2 from 'argon2'
import { vi } from 'vitest'
import { createLogger } from '../src/config/logger.js'
import { createMemoryRepositories } from '../src/repositories/memory.js'
import type { Repositories } from '../src/repositories/types.js'
import { createAccountService } from '../src/services/account.js'
import { createAuthService, type AuthServiceOptions } from '../src/services/auth.js'
import type { DatabaseState } from '../src/services/database.js'
import type { EmailMessage, Mailer } from '../src/services/mailer.js'
import { createArgon2Hasher, type PasswordHasher } from '../src/services/password.js'
import { mergeBookmarks, mergeProgress } from '../src/services/merge.js'
import { createProfileService } from '../src/services/profile.js'
import { createSyncService } from '../src/services/sync.js'
import { createContentService } from '../src/services/content.js'
import { bookmarkList, progressState } from '../src/validators/progress.js'

export const ALLOWED_ORIGIN = 'https://app.example.com'

/** A database stub with a fixed state: no MongoDB needed. */
export const fakeDb = (state: DatabaseState = 'connected') => ({ state: () => state })

export const silentLogger = () => createLogger({ LOG_LEVEL: 'silent' })

/** Real argon2id with minimal cost, so tests stay fast. Production parameters are tested in password.test.ts. */
export const fastHasher = () => createArgon2Hasher({ type: argon2.argon2id, memoryCost: 1024, timeCost: 1, parallelism: 1 })

/** An auth service over in-memory repositories: no MongoDB needed. */
export function testAuth(overrides: Partial<AuthServiceOptions> = {}) {
  const repositories = overrides.repositories ?? createMemoryRepositories()
  return { repositories, auth: createAuthService({ repositories, hasher: fastHasher(), ...overrides }) }
}

export const TEST_ENV: AppDependencies['env'] = { NODE_ENV: 'test', CORS_ORIGINS: [ALLOWED_ORIGIN], SESSION_COOKIE_NAME: 'gfi_session' }

export const APP_BASE_URL = 'https://app.example.com'

/** A mailer that keeps every message, so tests can read the links. */
export function recordingMailer(): Mailer & { sent: EmailMessage[] } {
  const sent: EmailMessage[] = []
  return {
    sent,
    async send(message) {
      sent.push(message)
    },
  }
}

/** The token from the most recent email whose link goes to `path` (e.g. /reset-password). */
export function tokenFromMail(sent: readonly EmailMessage[], path: '/reset-password' | '/verify-email'): string {
  const pattern = new RegExp(`${APP_BASE_URL}${path}#token=([A-Za-z0-9_-]+)`)
  for (const message of [...sent].reverse()) {
    const match = pattern.exec(message.text)
    if (match?.[1]) return match[1]
  }
  throw new Error(`no ${path} email was sent`)
}

/** Like tokenFromMail, but waits for the email: register and forgot-password send in the background. */
export const mailToken = (sent: readonly EmailMessage[], path: '/reset-password' | '/verify-email') => vi.waitFor(() => tokenFromMail(sent, path))

export interface TestServiceOptions {
  repositories?: Repositories
  hasher?: PasswordHasher
  mailer?: Mailer
  now?: () => Date
  logger?: ReturnType<typeof silentLogger>
}

/** Auth, account and profile services over one set of in-memory repositories. */
export function testServices({
  repositories = createMemoryRepositories(),
  hasher = fastHasher(),
  mailer = recordingMailer(),
  now,
  logger = silentLogger(),
}: TestServiceOptions = {}) {
  return {
    repositories,
    mailer,
    /** Emails sent, when the mailer is a recordingMailer(). */
    sent: 'sent' in mailer ? (mailer as ReturnType<typeof recordingMailer>).sent : [],
    auth: createAuthService({ repositories, hasher, now }),
    account: createAccountService({ repositories, hasher, mailer, logger, appBaseUrl: APP_BASE_URL, now }),
    profile: createProfileService(repositories),
    sync: {
      progress: createSyncService({ repository: repositories.progress, merge: mergeProgress, schema: progressState }),
      bookmarks: createSyncService({ repository: repositories.bookmarks, merge: mergeBookmarks, schema: bookmarkList }),
    },
    content: createContentService(repositories.content),
  }
}

/** Builds the real app with test dependencies. */
export function testApp(overrides: Partial<AppDependencies> = {}) {
  const { auth, account, profile, sync, content } = testServices()
  return createApp({
    env: TEST_ENV,
    db: fakeDb(),
    auth,
    account,
    profile,
    sync,
    content,
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

/** The committed content snapshots (backend/seed/*.json), parsed fresh for each call so tests can mutate them. */
export function readContentSnapshot() {
  const read = (name: string) => JSON.parse(readFileSync(new URL(`../seed/${name}`, import.meta.url), 'utf8')) as Record<string, unknown>
  return { catalog: read('catalog.json'), lessons: read('lessons.json'), questions: read('questions.json'), blog: read('blog.json') }
}
