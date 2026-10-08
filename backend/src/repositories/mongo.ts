import { isValidObjectId, mongo, type Connection } from 'mongoose'
import { sessionModel } from '../models/Session.js'
import { userModel } from '../models/User.js'
import { DuplicateEmailError, type Repositories, type SessionRecord, type UserRecord } from './types.js'

const DUPLICATE_KEY = 11000

interface UserLean {
  _id: { toString(): string }
  email: string
  passwordHash: string
  createdAt: Date
}

interface SessionLean {
  tokenHash: string
  userId: { toString(): string }
  expiresAt: Date
  createdAt: Date
}

const toUser = (doc: UserLean): UserRecord => ({
  id: doc._id.toString(),
  email: doc.email,
  passwordHash: doc.passwordHash,
  createdAt: doc.createdAt,
})

const toSession = (doc: SessionLean): SessionRecord => ({
  tokenHash: doc.tokenHash,
  userId: doc.userId.toString(),
  expiresAt: doc.expiresAt,
  createdAt: doc.createdAt,
})

/** MongoDB repositories on the given connection. Indexes (unique email, unique tokenHash, TTL) are built by Mongoose on connect. */
export function createMongoRepositories(connection: Connection): Repositories {
  const User = userModel(connection)
  const Session = sessionModel(connection)

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
    },
  }
}
