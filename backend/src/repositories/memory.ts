import { randomUUID } from 'node:crypto'
import {
  CONTENT_COLLECTIONS,
  DuplicateEmailError,
  DuplicateKeyError,
  type ContentCollectionConfig,
  type ContentFilter,
  type ContentRepositories,
  type ContentStore,
  type AuditEntry,
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

const getPath = (doc: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((value, key) => (typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[key] : undefined), doc)

/** Same behaviour as the MongoDB content store: key-based upsert, unique fields, display order. */
function memoryContentStore<T>({ key, unique, sort }: ContentCollectionConfig): ContentStore<T> {
  let docs: T[] = []
  const matches = (doc: T, filter: ContentFilter) => Object.entries(filter).every(([path, value]) => getPath(doc, path) === value)
  const keyFilter = (doc: T): ContentFilter => Object.fromEntries(key.map((path) => [path, getPath(doc, path) as string | number]))
  const compare = (a: T, b: T) => {
    for (const [path, direction] of sort) {
      const [x, y] = [getPath(a, path) as string | number, getPath(b, path) as string | number]
      if (x !== y) return (x < y ? -1 : 1) * direction
    }
    return 0
  }
  return {
    async list(filter = {}) {
      return docs.filter((doc) => matches(doc, filter)).sort(compare).map(clone)
    },
    async find(filter) {
      const doc = docs.find((d) => matches(d, filter))
      return doc ? clone(doc) : null
    },
    async upsert(doc) {
      const filter = keyFilter(doc)
      const index = docs.findIndex((d) => matches(d, filter))
      for (const path of unique) {
        if (docs.some((d, i) => i !== index && getPath(d, path) === getPath(doc, path))) throw new DuplicateKeyError(`Another document already has this ${path}`)
      }
      if (index === -1) {
        docs.push(clone(doc))
        return 'inserted'
      }
      if (JSON.stringify(docs[index]) === JSON.stringify(doc)) return 'unchanged'
      docs[index] = clone(doc)
      return 'updated'
    },
    async delete(filter) {
      const before = docs.length
      docs = docs.filter((doc) => !matches(doc, filter))
      return before - docs.length
    },
  }
}

const memoryContent = (): ContentRepositories => ({
  stages: memoryContentStore(CONTENT_COLLECTIONS.stages),
  modules: memoryContentStore(CONTENT_COLLECTIONS.modules),
  lessons: memoryContentStore(CONTENT_COLLECTIONS.lessons),
  questions: memoryContentStore(CONTENT_COLLECTIONS.questions),
  posts: memoryContentStore(CONTENT_COLLECTIONS.posts),
})

function memoryUsage() {
  const counts = new Map<string, number>()
  const key = (userId: string, metric: string, day: string) => `${userId}|${metric}|${day}`
  return {
    async consume(userId: string, metric: string, day: string, limit: number) {
      const current = counts.get(key(userId, metric, day)) ?? 0
      if (current >= limit) return null
      counts.set(key(userId, metric, day), current + 1)
      return current + 1
    },
    async release(userId: string, metric: string, day: string) {
      const current = counts.get(key(userId, metric, day)) ?? 0
      if (current > 0) counts.set(key(userId, metric, day), current - 1)
    },
    async get(userId: string, metric: string, day: string) {
      return counts.get(key(userId, metric, day)) ?? 0
    },
  }
}

function memoryAudit() {
  const entries: AuditEntry[] = []
  return {
    async append(entry: Omit<AuditEntry, 'id'>) {
      const stored: AuditEntry = { ...clone(entry), at: entry.at, id: randomUUID() }
      entries.push(stored)
      return { ...stored }
    },
    async list({ limit, before }: { limit: number; before?: Date }) {
      return entries
        .filter((e) => !before || e.at.getTime() < before.getTime())
        .sort((a, b) => b.at.getTime() - a.at.getTime())
        .slice(0, limit)
        .map((e) => ({ ...e }))
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
        const user: UserRecord = { id: randomUUID(), email, passwordHash, emailVerifiedAt: null, role: 'user', profile: {}, createdAt: new Date() }
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
        if (changes.role !== undefined) user.role = changes.role
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
    content: memoryContent(),
    audit: memoryAudit(),
    usage: memoryUsage(),
  }
}
