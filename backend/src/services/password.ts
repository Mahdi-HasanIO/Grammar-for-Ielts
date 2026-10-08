import { randomBytes } from 'node:crypto'
import argon2, { type HashOptions } from 'argon2'

export interface PasswordHasher {
  hash(password: string): Promise<string>
  /** False for a wrong password or a malformed hash; never throws for those. */
  verify(hash: string, password: string): Promise<boolean>
}

/**
 * argon2id with the OWASP Password Storage Cheat Sheet's baseline:
 * 19 MiB memory, 2 iterations, 1 lane (about 45 ms per hash on a laptop).
 * Parameters are stored in each hash, so they can be raised later and old
 * hashes still verify.
 */
export const ARGON2_OPTIONS: HashOptions = { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 }

export function createArgon2Hasher(options: HashOptions = ARGON2_OPTIONS): PasswordHasher {
  return {
    hash: (password) => argon2.hash(password, options),
    async verify(hash, password) {
      try {
        return await argon2.verify(hash, password)
      } catch {
        return false
      }
    },
  }
}

/**
 * A hash of a random password, made once, for checking against when the
 * email is unknown. Login then costs the same whether or not the account
 * exists, so response time does not reveal registered emails.
 */
export function dummyHash(hasher: PasswordHasher): () => Promise<string> {
  let hash: Promise<string> | undefined
  return () => (hash ??= hasher.hash(randomBytes(16).toString('base64url')))
}
