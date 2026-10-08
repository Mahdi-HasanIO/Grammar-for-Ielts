import { randomUUID } from 'node:crypto'
import {
  DuplicateEmailError,
  type AccountTokenRecord,
  type ProfileFields,
  type Repositories,
  type SessionRecord,
  type SyncRecord,
  type SyncRepository,
  type UserRecord,
} from './types.js'

/** Deep copy through JSON: synced data is plain JSON, and callers must not share stored objects. */
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T

function memorySync<T>(): SyncRepository<T> {
  const records = new Map<string, SyncRecord<T>>()
  return {
    async get(userId) {
      const record = records.get(userId)
      return record ? { ...record, data: clone(record.data) } : null
    },
    async put(userId, expectedVersion, data) {
      if ((records.get(userId)?.version ?? 0) !== expectedVersion) return null
      const record: SyncRecord<T> = { userId, version: expectedVersion + 1, data: clone(data), updatedAt: new Date() }
      records.set(userId, record)
      return { ...record, data: clone(record.data) }
    },
  }
}

const copyUser = (user: UserRecord): UserRecord => ({ ...user, profile: { ...user.profile } })

/**
 * In-memory repositories with the same behaviour as the MongoDB ones
 * (unique email, unique token hashes, one account token per user and type).
 * For tests; data is lost on restart. Records are copied in and out so
 * callers cannot mutate stored state.
 */
export function createMemoryRepositories(): Repositories {
  const users = new Map<string, UserRecord>()
  const sessions = new Map<string, SessionRecord>()
  /** Keyed by `${userId}:${type}`: one token per user and type. */
  const accountTokens = new Map<string, AccountTokenRecord>()

  return {
    users: {
      async create({ email, passwordHash }) {
        if ([...users.values()].some((user) => user.email === email)) throw new DuplicateEmailError()
        const user: UserRecord = { id: randomUUID(), email, passwordHash, emailVerifiedAt: null, profile: {}, createdAt: new Date() }
        users.set(user.id, user)
        return copyUser(user)
      },
      async findByEmail(email) {
        const user = [...users.values()].find((u) => u.email === email)
        return user ? copyUser(user) : null
      },
      async findById(id) {
        const user = users.get(id)
        return user ? copyUser(user) : null
      },
      async update(id, changes) {
        const user = users.get(id)
        if (!user) return null
        if (changes.passwordHash !== undefined) user.passwordHash = changes.passwordHash
        if (changes.emailVerifiedAt !== undefined) user.emailVerifiedAt = changes.emailVerifiedAt
        for (const [key, value] of Object.entries(changes.profile ?? {}) as [keyof ProfileFields, unknown][]) {
          if (value === null) delete user.profile[key]
          else if (value !== undefined) (user.profile as Record<string, unknown>)[key] = value
        }
        return copyUser(user)
      },
    },
    sessions: {
      async create({ tokenHash, userId, expiresAt }) {
        if (sessions.has(tokenHash)) throw new Error('Duplicate session token hash')
        const session: SessionRecord = { tokenHash, userId, expiresAt, createdAt: new Date() }
        sessions.set(tokenHash, session)
        return { ...session }
      },
      async findByTokenHash(tokenHash) {
        const session = sessions.get(tokenHash)
        return session ? { ...session } : null
      },
      async deleteByTokenHash(tokenHash) {
        sessions.delete(tokenHash)
      },
      async deleteAllForUser(userId, keepTokenHash) {
        for (const [hash, session] of sessions) {
          if (session.userId === userId && hash !== keepTokenHash) sessions.delete(hash)
        }
      },
    },
    accountTokens: {
      async replace({ tokenHash, userId, type, expiresAt }) {
        accountTokens.set(`${userId}:${type}`, { tokenHash, userId, type, expiresAt, createdAt: new Date() })
      },
      async consume(tokenHash, type) {
        for (const [key, token] of accountTokens) {
          if (token.tokenHash === tokenHash && token.type === type) {
            accountTokens.delete(key)
            return { ...token }
          }
        }
        return null
      },
      async deleteForUser(userId, type) {
        accountTokens.delete(`${userId}:${type}`)
      },
    },
    progress: memorySync(),
    bookmarks: memorySync(),
  }
}
