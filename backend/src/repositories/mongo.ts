import { isValidObjectId, mongo, type Connection, type Model } from 'mongoose'
import { accountTokenModel } from '../models/AccountToken.js'
import { sessionModel } from '../models/Session.js'
import { bookmarksModel, progressModel } from '../models/SyncDocument.js'
import type { Bookmark, ProgressState } from '../validators/progress.js'
import { userModel } from '../models/User.js'
import {
  DuplicateEmailError,
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
  }
}
