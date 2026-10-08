import { isValidObjectId, mongo, type Connection, type Model } from 'mongoose'
import { accountTokenModel } from '../models/AccountToken.js'
import { auditModel } from '../models/AuditLog.js'
import { usageModel, USAGE_RETENTION_DAYS } from '../models/UsageCounter.js'
import { contentModels } from '../models/Content.js'
import { sessionModel } from '../models/Session.js'
import { bookmarksModel, progressModel } from '../models/SyncDocument.js'
import type { Bookmark, ProgressState } from '../validators/progress.js'
import { userModel } from '../models/User.js'
import {
  CONTENT_COLLECTIONS,
  DuplicateEmailError,
  DuplicateKeyError,
  type ContentCollectionConfig,
  type ContentRepositories,
  type ContentStore,
  type AuditEntry,
  type Plan,
  type Role,
  PROFILE_FIELDS,
  type AccountTokenRecord,
  type AccountTokenType,
  type ProfileFields,
  type Repositories,
  type SessionRecord,
  type SyncRecord,
  type SyncRepository,
  type UserRecord,
} from './types.js'

const DUPLICATE_KEY = 11000

type UserLean = {
  _id: { toString(): string }
  email: string
  passwordHash: string
  emailVerifiedAt?: Date | null
  role?: Role
  plan?: Plan
  planExpiresAt?: Date | null
  createdAt: Date
} & { [K in keyof ProfileFields]?: ProfileFields[K] | null }

interface SessionLean {
  tokenHash: string
  userId: { toString(): string }
  expiresAt: Date
  createdAt: Date
}

interface AccountTokenLean {
  tokenHash: string
  userId: { toString(): string }
  type: AccountTokenType
  expiresAt: Date
  createdAt: Date
}

function toUser(doc: UserLean): UserRecord {
  const profile: Record<string, unknown> = {}
  for (const field of PROFILE_FIELDS) {
    const value = doc[field]
    if (value !== undefined && value !== null) profile[field] = value
  }
  return {
    id: doc._id.toString(),
    email: doc.email,
    passwordHash: doc.passwordHash,
    emailVerifiedAt: doc.emailVerifiedAt ?? null,
    role: doc.role ?? 'user',
    plan: doc.plan ?? 'free',
    planExpiresAt: doc.planExpiresAt ?? null,
    profile: profile as ProfileFields,
    createdAt: doc.createdAt,
  }
}

const toSession = (doc: SessionLean): SessionRecord => ({
  tokenHash: doc.tokenHash,
  userId: doc.userId.toString(),
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
})

const toAccountToken = (doc: AccountTokenLean): AccountTokenRecord => ({
  tokenHash: doc.tokenHash,
  userId: doc.userId.toString(),
  type: doc.type,
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
})

interface SyncLean {
  userId: { toString(): string }
  version: number
  data: unknown
  updatedAt: Date
}

const toSync = <T>(doc: SyncLean): SyncRecord<T> => ({
  userId: doc.userId.toString(),
  version: doc.version,
  data: doc.data as T,
  updatedAt: doc.updatedAt,
})

/** Compare-and-set on { userId, version } for one per-user document. */
function syncRepository<T>(model: Model<never>): SyncRepository<T> {
  const Sync = model as unknown as Model<SyncLean>
  return {
    async get(userId) {
      if (!isValidObjectId(userId)) return null
      const doc = await Sync.findOne({ userId }).lean<SyncLean>()
      return doc ? toSync<T>(doc) : null
    },
    async put(userId, expectedVersion, data) {
      const updatedAt = new Date()
      if (expectedVersion === 0) {
        try {
          const doc = await Sync.create({ userId, version: 1, data, updatedAt })
          return toSync<T>(doc.toObject() as SyncLean)
        } catch (error) {
          // Another first write won the race (unique userId).
          if (error instanceof mongo.MongoServerError && error.code === DUPLICATE_KEY) return null
          throw error
        }
      }
      const doc = await Sync.findOneAndUpdate(
        { userId, version: expectedVersion },
        { $set: { data, updatedAt }, $inc: { version: 1 } },
        { returnDocument: 'after' },
      ).lean<SyncLean>()
      return doc ? toSync<T>(doc) : null
    },
  }
}

const getPath = (doc: unknown, path: string): unknown =>
  path.split('.').reduce<unknown>((value, key) => (typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[key] : undefined), doc)

/**
 * A content collection through the native driver (model.collection), so
 * documents are stored exactly as validated, without Mongoose casting. The
 * Mongoose model is still what declares and builds the indexes.
 */
function mongoContentStore<T>(model: Model<never>, { key, sort }: ContentCollectionConfig): ContentStore<T> {
  const collection = model.collection
  const noId = { projection: { _id: 0 } }
  return {
    async list(filter = {}) {
      return (await collection.find(filter, noId).sort(Object.fromEntries(sort)).toArray()) as T[]
    },
    async find(filter) {
      return (await collection.findOne(filter, noId)) as T | null
    },
    async upsert(doc) {
      const filter = Object.fromEntries(key.map((path) => [path, getPath(doc, path)]))
      try {
        // replaceOne reports modifiedCount 0 when the stored document is already identical.
        const result = await collection.replaceOne(filter, doc as Record<string, unknown>, { upsert: true })
        if (result.upsertedCount) return 'inserted'
        return result.modifiedCount ? 'updated' : 'unchanged'
      } catch (error) {
        if (error instanceof mongo.MongoServerError && error.code === DUPLICATE_KEY) throw new DuplicateKeyError()
        throw error
      }
    },
    async delete(filter) {
      return (await collection.deleteMany(filter)).deletedCount
    },
  }
}

function mongoUsage(connection: Connection) {
  const Usage = usageModel(connection)
  return {
    async consume(userId: string, metric: string, day: string, limit: number) {
      if (limit <= 0) return null
      const expiresAt = new Date(Date.parse(`${day}T00:00:00Z`) + USAGE_RETENTION_DAYS * 86_400_000)
      try {
        // Matches only while below the limit. At the limit the filter misses, the upsert tries to insert a
        // second { userId, metric, day } and the unique index refuses it: that is "limit reached".
        const doc = await Usage.findOneAndUpdate(
          { userId, metric, day, count: { $lt: limit } },
          { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
          { upsert: true, returnDocument: 'after' },
        ).lean<{ count: number }>()
        return doc?.count ?? null
      } catch (error) {
        if (error instanceof mongo.MongoServerError && error.code === DUPLICATE_KEY) return null
        throw error
      }
    },
    async release(userId: string, metric: string, day: string) {
      await Usage.updateOne({ userId, metric, day, count: { $gt: 0 } }, { $inc: { count: -1 } })
    },
    async get(userId: string, metric: string, day: string) {
      return (await Usage.findOne({ userId, metric, day }).lean<{ count: number }>())?.count ?? 0
    },
  }
}

function mongoAudit(connection: Connection) {
  const Audit = auditModel(connection)
  type AuditLean = Omit<AuditEntry, 'id'> & { _id: { toString(): string } }
  const toEntry = ({ _id, ...entry }: AuditLean): AuditEntry => ({ id: _id.toString(), ...entry })
  return {
    async append(entry: Omit<AuditEntry, 'id'>) {
      const doc = await Audit.create(entry)
      return toEntry(doc.toObject() as unknown as AuditLean)
    },
    async list({ limit, before }: { limit: number; before?: Date }) {
      const docs = await Audit.find(before ? { at: { $lt: before } } : {}).sort({ at: -1 }).limit(limit).lean<AuditLean[]>()
      return docs.map(toEntry)
    },
  }
}

function mongoContent(connection: Connection): ContentRepositories {
  const models = contentModels(connection) as unknown as Record<keyof ContentRepositories, Model<never>>
  return {
    stages: mongoContentStore(models.stages, CONTENT_COLLECTIONS.stages),
    modules: mongoContentStore(models.modules, CONTENT_COLLECTIONS.modules),
    lessons: mongoContentStore(models.lessons, CONTENT_COLLECTIONS.lessons),
    questions: mongoContentStore(models.questions, CONTENT_COLLECTIONS.questions),
    posts: mongoContentStore(models.posts, CONTENT_COLLECTIONS.posts),
  }
}

/**
 * MongoDB repositories on the given connection. Indexes (unique email, unique
 * token hashes, one account token per user and type, TTLs) are built by
 * Mongoose on connect.
 */
export function createMongoRepositories(connection: Connection): Repositories {
  const User = userModel(connection)
  const Session = sessionModel(connection)
  const AccountToken = accountTokenModel(connection)
  const progress = syncRepository<ProgressState>(progressModel(connection) as never)
  const bookmarks = syncRepository<Bookmark[]>(bookmarksModel(connection) as never)

  return {
    users: {
      async create({ email, passwordHash }) {
        try {
          const doc = await User.create({ email, passwordHash })
          return toUser(doc.toObject() as UserLean)
        } catch (error) {
          if (error instanceof mongo.MongoServerError && error.code === DUPLICATE_KEY) throw new DuplicateEmailError()
          throw error
        }
      },
      async findByEmail(email) {
        const doc = await User.findOne({ email }).lean<UserLean>()
        return doc ? toUser(doc) : null
      },
      async findById(id) {
        if (!isValidObjectId(id)) return null
        const doc = await User.findById(id).lean<UserLean>()
        return doc ? toUser(doc) : null
      },
      async update(id, changes) {
        if (!isValidObjectId(id)) return null
        const set: Record<string, unknown> = {}
        const unset: Record<string, ''> = {}
        if (changes.passwordHash !== undefined) set.passwordHash = changes.passwordHash
        if (changes.emailVerifiedAt !== undefined) set.emailVerifiedAt = changes.emailVerifiedAt
        if (changes.role !== undefined) set.role = changes.role
        if (changes.plan !== undefined) set.plan = changes.plan
        if (changes.planExpiresAt === null) unset.planExpiresAt = ''
        else if (changes.planExpiresAt !== undefined) set.planExpiresAt = changes.planExpiresAt
        for (const [key, value] of Object.entries(changes.profile ?? {})) {
          if (value === null) unset[key] = ''
          else if (value !== undefined) set[key] = value
        }
        const update: Record<string, unknown> = {}
        if (Object.keys(set).length) update.$set = set
        if (Object.keys(unset).length) update.$unset = unset
        const doc = await User.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true }).lean<UserLean>()
        return doc ? toUser(doc) : null
      },
    },
    sessions: {
      async create({ tokenHash, userId, expiresAt }) {
        const doc = await Session.create({ tokenHash, userId, expiresAt })
        return toSession(doc.toObject() as SessionLean)
      },
      async findByTokenHash(tokenHash) {
        const doc = await Session.findOne({ tokenHash }).lean<SessionLean>()
        return doc ? toSession(doc) : null
      },
      async deleteByTokenHash(tokenHash) {
        await Session.deleteOne({ tokenHash })
      },
      async deleteAllForUser(userId, keepTokenHash) {
        if (!isValidObjectId(userId)) return
        await Session.deleteMany(keepTokenHash === undefined ? { userId } : { userId, tokenHash: { $ne: keepTokenHash } })
      },
    },
    accountTokens: {
      async replace({ tokenHash, userId, type, expiresAt }) {
        // One atomic upsert on the unique (userId, type) index: the previous token's hash is overwritten.
        await AccountToken.findOneAndUpdate(
          { userId, type },
          { $set: { tokenHash, expiresAt, createdAt: new Date() } },
          { upsert: true, runValidators: true },
        )
      },
      async consume(tokenHash, type) {
        // findOneAndDelete is atomic: two concurrent uses of the same token cannot both succeed.
        const doc = await AccountToken.findOneAndDelete({ tokenHash, type }).lean<AccountTokenLean>()
        return doc ? toAccountToken(doc) : null
      },
      async deleteForUser(userId, type) {
        if (!isValidObjectId(userId)) return
        await AccountToken.deleteMany({ userId, type })
      },
    },
    progress,
    bookmarks,
    content: mongoContent(connection),
    audit: mongoAudit(connection),
    usage: mongoUsage(connection),
  }
}
