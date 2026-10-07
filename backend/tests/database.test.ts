import { describe, expect, it } from 'vitest'
import { createDatabase } from '../src/services/database.js'
import { redactConnectionStrings } from '../src/utils/redact.js'
import { capturingLogger } from './helpers.js'

describe('database connection (no MongoDB running)', () => {
  it('does not throw when the server is unreachable, reports disconnected, logs without credentials, and stops cleanly', async () => {
    const { logger, lines } = capturingLogger()
    // Port 1 on localhost: nothing listens there, so the attempt fails fast.
    const db = createDatabase({
      uri: 'mongodb://appuser:TopSecret123@127.0.0.1:1/test',
      logger,
      serverSelectionTimeoutMS: 300,
      retryDelayMs: 60_000,
    })
    expect(db.state()).toBe('disconnected')
    await expect(db.connect()).resolves.toBeUndefined()
    expect(db.state()).toBe('disconnected')

    const failure = lines.map((l) => JSON.parse(l)).find((e) => e.msg === 'MongoDB connection failed; retrying')
    expect(failure).toMatchObject({ level: 40, retryInMs: 60_000 })
    expect(lines.join('\n')).not.toContain('TopSecret123')

    await expect(db.disconnect()).resolves.toBeUndefined()
    expect(db.state()).toBe('disconnected')
  })
})

describe('shutdown while a connection attempt is in progress', () => {
  it('does not wait for the attempt to time out', async () => {
    const { logger } = capturingLogger()
    const db = createDatabase({ uri: 'mongodb://127.0.0.1:1/test', logger, serverSelectionTimeoutMS: 5_000 })
    const pending = db.connect()
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(db.state()).toBe('connecting')
    const started = Date.now()
    await db.disconnect()
    expect(Date.now() - started).toBeLessThan(1_000)
    await pending
  }, 10_000)
})

describe('redactConnectionStrings', () => {
  it.each([
    ['failed for mongodb://user:pa55@host:27017/db', 'failed for mongodb://***@host:27017/db'],
    ['mongodb+srv://admin:s3cret@cluster0.example.net/app?x=1', 'mongodb+srv://***@cluster0.example.net/app?x=1'],
    ['mongodb://127.0.0.1:27017/db', 'mongodb://127.0.0.1:27017/db'],
  ])('%s', (input, expected) => {
    expect(redactConnectionStrings(input)).toBe(expected)
  })
})
