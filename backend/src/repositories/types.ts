/*
 * Persistence interfaces. Services depend on these, not on Mongoose, so tests
 * run against the in-memory implementations (repositories/memory.ts) without
 * a database. repositories/mongo.ts is the MongoDB implementation.
 */

export interface UserRecord {
  id: string
  /** Normalised: trimmed and lowercased. */
  email: string
  passwordHash: string
  createdAt: Date
}

export interface SessionRecord {
  /** SHA-256 (hex) of the session token. */
  tokenHash: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

/** Thrown by UserRepository.create when the email is already registered. */
export class DuplicateEmailError extends Error {
  constructor() {
    super('Email already registered')
    this.name = 'DuplicateEmailError'
  }
}

export interface UserRepository {
  /** Throws DuplicateEmailError if the email exists (enforced by a unique index, so it is race-safe). */
  create(input: { email: string; passwordHash: string }): Promise<UserRecord>
  findByEmail(email: string): Promise<UserRecord | null>
  findById(id: string): Promise<UserRecord | null>
}

export interface SessionRepository {
  create(input: { tokenHash: string; userId: string; expiresAt: Date }): Promise<SessionRecord>
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>
  deleteByTokenHash(tokenHash: string): Promise<void>
}

export interface Repositories {
  users: UserRepository
  sessions: SessionRepository
}
