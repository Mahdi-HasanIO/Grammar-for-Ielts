import { randomUUID } from 'node:crypto'
import { Types } from 'mongoose'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMongoRepositories } from '../src/repositories/mongo.js'
import { createDatabase } from '../src/services/database.js'
import { mergeProgress } from '../src/services/merge.js'
import { createSyncService } from '../src/services/sync.js'
import { progressState, type ProgressState } from '../src/validators/progress.js'
import { silentLogger, withDatabaseName } from './helpers.js'

/**
 * Opt-in: runs only when MONGODB_URI_TEST is set (never in CI). Uses a
 * throwaway database that is dropped afterwards.
 */
const baseUri = process.env.MONGODB_URI_TEST

const state = (badges: string[]): ProgressState => ({
  schemaVersion: 1,
  modules: { '12': { moduleId: 12, completed: true, lessonViewed: true, practiceCompleted: false, bestScore: 50, latestScore: 50, attempts: 1 } },
  attempts: [],
  activity: { '2026-01-02': { date: '2026-01-02', minutes: 5, modulesCompleted: 0, testsTaken: 0, questionsAnswered: 0, questionsCorrect: 0 } },
  badges,
  xp: 0,
  startedAt: '2026-01-01T00:00:00.000Z',
})

describe.skipIf(!baseUri)('progress sync against MongoDB (MONGODB_URI_TEST)', () => {
  const uri = baseUri ? withDatabaseName(baseUri, `grammar-ielts-it-${randomUUID().slice(0, 8)}`) : ''
  const db = createDatabase({ uri, logger: silentLogger(), serverSelectionTimeoutMS: 10_000 })
  const repositories = createMongoRepositories(db.connection)
  const service = createSyncService({ repository: repositories.progress, merge: mergeProgress, schema: progressState })
  const userId = new Types.ObjectId().toString()

  beforeAll(async () => {
    await db.connect()
    await db.connection.syncIndexes()
  }, 30_000)

  afterAll(async () => {
    if (db.state() === 'connected') await db.connection.dropDatabase()
    await db.disconnect()
  }, 30_000)

  it('stores the document as given (numeric and date keys survive) and versions it', async () => {
    const written = await service.put(userId, 0, state(['a']))
    expect(written).toMatchObject({ version: 1, merged: false })
    expect((await service.get(userId)).data).toEqual(state(['a']))
  })

  it('compare-and-set: concurrent writers based on version 1 all land, one version each', async () => {
    // The first to commit is up to date (base 1 = stored 1) and replaces the data, dropping "a" as that
    // client intended; the others are then stale and merge with it.
    const results = await Promise.all(['b', 'c', 'd'].map((badge) => service.put(userId, 1, state([badge]))))
    expect(results.map((r) => r.version).sort()).toEqual([2, 3, 4])
    const saved = await service.get(userId)
    expect(saved.version).toBe(4)
    expect([...(saved.data?.badges ?? [])].sort()).toEqual(['b', 'c', 'd'])
    expect(await db.connection.collection('progress').countDocuments()).toBe(1)
  })
})
