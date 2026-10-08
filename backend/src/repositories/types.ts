/*
 * Persistence interfaces. Services depend on these, not on Mongoose, so tests
 * run against the in-memory implementations (repositories/memory.ts) without
 * a database. repositories/mongo.ts is the MongoDB implementation.
 */

import type { Bookmark, ProgressState } from '../validators/progress.js'

export const LANGUAGES = ['en', 'bn'] as const
export type Language = (typeof LANGUAGES)[number]

/** Optional profile fields a user sets themselves. Unset fields are absent. */
export interface ProfileFields {
  displayName?: string
  /** IELTS band, 4.0–9.0 in steps of 0.5. */
  targetBand?: number
  /** Calendar date, YYYY-MM-DD. */
  examDate?: string
  /** IANA time zone name, e.g. Asia/Dhaka. */
  timezone?: string
  dailyGoalMinutes?: number
  language?: Language
}

export const PROFILE_FIELDS = ['displayName', 'targetBand', 'examDate', 'timezone', 'dailyGoalMinutes', 'language'] as const satisfies readonly (keyof ProfileFields)[]

export interface UserRecord {
  id: string
  /** Normalised: trimmed and lowercased. */
  email: string
  passwordHash: string
  emailVerifiedAt: Date | null
  profile: ProfileFields
  createdAt: Date
}

/** A partial update. In `profile`, null removes the field. */
export interface UserChanges {
  passwordHash?: string
  emailVerifiedAt?: Date
  profile?: { [K in keyof ProfileFields]?: ProfileFields[K] | null }
}

export interface SessionRecord {
  /** SHA-256 (hex) of the session token. */
  tokenHash: string
  userId: string
  expiresAt: Date
  createdAt: Date
}

export type AccountTokenType = 'password_reset' | 'email_verification'

export interface AccountTokenRecord {
  /** SHA-256 (hex) of the token. The token itself only exists in the email that was sent. */
  tokenHash: string
  userId: string
  type: AccountTokenType
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
  /** Applies the changes and returns the updated user, or null if there is no such user. */
  update(id: string, changes: UserChanges): Promise<UserRecord | null>
}

export interface SessionRepository {
  create(input: { tokenHash: string; userId: string; expiresAt: Date }): Promise<SessionRecord>
  findByTokenHash(tokenHash: string): Promise<SessionRecord | null>
  deleteByTokenHash(tokenHash: string): Promise<void>
  /** Ends every session of the user, except the one with `keepTokenHash` if given. */
  deleteAllForUser(userId: string, keepTokenHash?: string): Promise<void>
}

export interface AccountTokenRepository {
  /**
   * Stores a new token, replacing any existing token of the same type for
   * the user (one per user and type, enforced by a unique index), so an
   * older link stops working as soon as a new one is requested.
   */
  replace(input: { tokenHash: string; userId: string; type: AccountTokenType; expiresAt: Date }): Promise<void>
  /**
   * Single use: atomically removes the token and returns it, or null if it
   * does not exist. Expiry is checked by the caller.
   */
  consume(tokenHash: string, type: AccountTokenType): Promise<AccountTokenRecord | null>
  deleteForUser(userId: string, type: AccountTokenType): Promise<void>
}

/** A per-user synced document (progress, bookmarks): the data plus a version that grows by one per write. */
export interface SyncRecord<T> {
  userId: string
  version: number
  data: T
  updatedAt: Date
}

export interface SyncRepository<T> {
  get(userId: string): Promise<SyncRecord<T> | null>
  /**
   * Compare-and-set: writes `data` only if the stored version is still
   * `expectedVersion` (0 = no document yet), and returns the new record with
   * version + 1. Returns null if another write got there first.
   */
  put(userId: string, expectedVersion: number, data: T): Promise<SyncRecord<T> | null>
}

export interface Repositories {
  users: UserRepository
  sessions: SessionRepository
  accountTokens: AccountTokenRepository
  progress: SyncRepository<ProgressState>
  bookmarks: SyncRepository<Bookmark[]>
}
