import type { z } from 'zod'
import type { SyncRepository } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'

export interface SyncResult<T> {
  data: T | null
  /** 0 when the user has never synced. */
  version: number
  updatedAt: Date | null
}

export interface SyncWriteResult<T> extends SyncResult<T> {
  data: T
  /** True when the write was based on an older version and was merged with the stored data. */
  merged: boolean
}

export interface SyncService<T> {
  get(userId: string): Promise<SyncResult<T>>
  /**
   * Saves `data` written against `baseVersion`. If that is the stored version,
   * `data` replaces it. Otherwise another device wrote in between: the two are
   * merged newest-per-item (nothing is dropped) and the result is stored and
   * returned, so the client can adopt it.
   */
  put(userId: string, baseVersion: number, data: T): Promise<SyncWriteResult<T>>
}

/** Concurrent writers retry the compare-and-set this many times before giving up with 409. */
const MAX_ATTEMPTS = 5

export function createSyncService<T>({
  repository,
  merge,
  schema,
}: {
  repository: SyncRepository<T>
  merge: (server: T, client: T) => T
  /** Re-checked after a merge: a union can exceed the size caps. */
  schema: z.ZodType<T>
}): SyncService<T> {
  return {
    async get(userId) {
      const record = await repository.get(userId)
      return record ? { data: record.data, version: record.version, updatedAt: record.updatedAt } : { data: null, version: 0, updatedAt: null }
    },

    async put(userId, baseVersion, data) {
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const current = await repository.get(userId)
        const currentVersion = current?.version ?? 0
        const merged = current !== null && baseVersion !== currentVersion
        const next = merged ? merge(current.data, data) : data
        if (merged && !schema.safeParse(next).success) {
          // Never trim to fit: that would drop someone's data without telling them.
          throw new AppError(422, 'sync_limit_exceeded', 'Merging with the saved data would exceed the size limits; nothing was changed')
        }
        const written = await repository.put(userId, currentVersion, next)
        if (written) return { data: written.data, version: written.version, updatedAt: written.updatedAt, merged }
      }
      throw new AppError(409, 'sync_conflict', 'The data changed while saving. Please try again')
    },
  }
}
