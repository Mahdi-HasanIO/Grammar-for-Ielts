import { randomUUID } from 'node:crypto'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createMongoRepositories } from '../src/repositories/mongo.js'
import { DuplicateKeyError } from '../src/repositories/types.js'
import { createContentService } from '../src/services/content.js'
import { contentFromSnapshot, seedContent } from '../src/services/contentSeed.js'
import { createDatabase } from '../src/services/database.js'
import { readContentSnapshot, silentLogger, withDatabaseName } from './helpers.js'

/**
 * Opt-in: runs only when MONGODB_URI_TEST is set (never in CI). Seeds a
 * throwaway database that is dropped afterwards.
 */
const baseUri = process.env.MONGODB_URI_TEST

describe.skipIf(!baseUri)('content seed and API store against MongoDB (MONGODB_URI_TEST)', () => {
  const uri = baseUri ? withDatabaseName(baseUri, `grammar-ielts-it-${randomUUID().slice(0, 8)}`) : ''
  const db = createDatabase({ uri, logger: silentLogger(), serverSelectionTimeoutMS: 10_000 })
  const { content: repos } = createMongoRepositories(db.connection)
  const content = contentFromSnapshot(readContentSnapshot())

  beforeAll(async () => {
    await db.connect()
    await db.connection.syncIndexes()
  }, 30_000)

  afterAll(async () => {
    if (db.state() === 'connected') await db.connection.dropDatabase()
    await db.disconnect()
  }, 30_000)

  it('seeds everything, then a second run reports everything unchanged', async () => {
    const first = await seedContent(repos, content)
    expect(first.questions.inserted).toBe(336)
    const second = await seedContent(repos, content)
    for (const counts of Object.values(second)) expect(counts.inserted + counts.updated).toBe(0)
  }, 120_000)

  it('stores documents exactly as validated, and reads them back in order', async () => {
    const service = createContentService(repos)
    const lesson = await service.lesson('articles', 'en')
    expect(lesson).toEqual(content.lessons.find((l) => l.moduleId === 3 && l.language === 'en'))
    expect((await service.questions('3', 'test')).map((q) => q.position)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    expect((await service.catalog()).modules).toHaveLength(24)
  })

  it('the unique slug index rejects a second module with the same slug', async () => {
    const clash = { ...content.modules[0]!, legacyId: 9999, topic: { ...content.modules[0]!.topic, slug: 'unique-topic-slug' } }
    await expect(repos.modules.upsert(clash)).rejects.toBeInstanceOf(DuplicateKeyError)
  })
})
