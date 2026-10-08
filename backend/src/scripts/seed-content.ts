import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { EnvError, loadEnv } from '../config/env.js'
import { createLogger } from '../config/logger.js'
import { createMongoRepositories } from '../repositories/mongo.js'
import { ContentValidationError, contentFromSnapshot, seedContent } from '../services/contentSeed.js'
import { createDatabase } from '../services/database.js'

/*
 * Seeds the content collections from the committed snapshots in backend/seed/.
 * Idempotent: a second run reports everything unchanged.
 *
 *   npm run seed:content            validate, then write to MONGODB_URI
 *   npm run seed:content -- --check validate only (no database needed)
 *
 * Refresh the snapshots from the app first with: node scripts/export-content-snapshot.mjs (repository root).
 */

/** backend/seed, from src/scripts or dist/scripts alike. */
const SEED_DIR = path.resolve(import.meta.dirname, '..', '..', 'seed')

async function readSnapshot() {
  const read = async (name: string) => JSON.parse(await readFile(path.join(SEED_DIR, name), 'utf8')) as unknown
  return { catalog: await read('catalog.json'), lessons: await read('lessons.json'), questions: await read('questions.json'), blog: await read('blog.json') }
}

async function main(): Promise<void> {
  const content = contentFromSnapshot(await readSnapshot())
  const counts = Object.fromEntries(Object.entries(content).map(([k, v]) => [k, v.length]))
  console.log(`Snapshot is valid: ${JSON.stringify(counts)}`)
  if (process.argv.includes('--check')) return

  try {
    process.loadEnvFile()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
  const env = loadEnv()
  const logger = createLogger(env)
  const db = createDatabase({ uri: env.MONGODB_URI, logger, serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, retryDelayMs: 60_000 })
  await db.connect()
  if (db.state() !== 'connected') throw new Error('Could not connect to MongoDB (see the log above)')
  try {
    await db.connection.syncIndexes()
    const report = await seedContent(createMongoRepositories(db.connection).content, content)
    console.log(`Seeded: ${JSON.stringify(report)}`)
  } finally {
    await db.disconnect()
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof ContentValidationError || error instanceof EnvError ? error.message : error)
  process.exitCode = 1
})
