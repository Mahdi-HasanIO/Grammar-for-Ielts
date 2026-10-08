import { randomUUID } from 'node:crypto'
import { DuplicateEmailError, type Repositories, type SessionRecord, type UserRecord } from './types.js'

/**
 * In-memory repositories with the same behaviour as the MongoDB ones
 * (unique email, unique token hash). For tests; data is lost on restart.
 * Records are copied in and out so callers cannot mutate stored state.
 */
export function createMemoryRepositories(): Repositories {
  const users = new Map<string, UserRecord>()
  const sessions = new Map<string, SessionRecord>()

  return {
    users: {
      async create({ email, passwordHash }) {
        if ([...users.values()].some((user) => user.email === email)) throw new DuplicateEmailError()
        const user: UserRecord = { id: randomUUID(), email, passwordHash, createdAt: new Date() }
        users.set(user.id, user)
        return { ...user }
      },
      async findByEmail(email) {
        const user = [...users.values()].find((u) => u.email === email)
        return user ? { ...user } : null
      },
      async findById(id) {
        const user = users.get(id)
        return user ? { ...user } : null
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
    },
  }
}
