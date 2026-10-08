import mongoose, { mongo, type Connection } from 'mongoose'
import type { Logger } from '../config/logger.js'
import { redactConnectionStrings } from '../utils/redact.js'

export type DatabaseState = 'disconnected' | 'connecting' | 'connected' | 'disconnecting'

/** What the HTTP layer needs: the current state, for the readiness check. */
export interface DatabaseStatus {
  state(): DatabaseState
}

export interface Database extends DatabaseStatus {
  /** The underlying connection, for registering models. Queries fail fast (no buffering) while disconnected. */
  readonly connection: Connection
  /** Starts connecting. Resolves after the first attempt; on failure it keeps retrying in the background. */
  connect(): Promise<void>
  /** Stops retrying and closes the connection. */
  disconnect(): Promise<void>
}

export interface DatabaseOptions {
  uri: string
  logger: Logger
  /** How long one attempt waits for a server before failing. */
  serverSelectionTimeoutMS?: number
  /** Delay before the first retry; doubles up to maxRetryDelayMs. */
  retryDelayMs?: number
  maxRetryDelayMs?: number
}

/**
 * True for errors meaning "the database cannot be reached right now" (as
 * opposed to a bug or a bad query), so the API can answer 503 instead of 500.
 */
export function isDatabaseUnavailableError(error: unknown): boolean {
  return (
    error instanceof mongoose.Error.MongooseServerSelectionError ||
    error instanceof mongo.MongoServerSelectionError ||
    error instanceof mongo.MongoNetworkError ||
    error instanceof mongo.MongoNotConnectedError ||
    error instanceof mongo.MongoTopologyClosedError
  )
}

// Mongoose readyState values: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting (99 uninitialised).
const STATES: Record<number, DatabaseState> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }

/**
 * A dedicated MongoDB connection (not mongoose's global one, so tests and
 * future multi-connection setups stay isolated). The API starts and serves
 * /api/health even when the database is unreachable; /api/health/ready
 * reports the state.
 */
export function createDatabase({
  uri,
  logger,
  serverSelectionTimeoutMS = 5_000,
  retryDelayMs = 2_000,
  maxRetryDelayMs = 30_000,
}: DatabaseOptions): Database {
  const connection = mongoose.createConnection()
  let stopped = false
  let retryTimer: NodeJS.Timeout | undefined
  let nextDelay = retryDelayMs

  connection.on('disconnected', () => {
    if (!stopped) logger.warn('MongoDB disconnected')
  })
  connection.on('reconnected', () => logger.info('MongoDB reconnected'))

  async function attempt(): Promise<void> {
    if (stopped) return
    try {
      await connection.openUri(uri, {
        serverSelectionTimeoutMS,
        // Fail queries immediately while disconnected instead of queueing them until a timeout.
        bufferCommands: false,
      })
      nextDelay = retryDelayMs
      logger.info('MongoDB connected')
    } catch (error) {
      if (stopped) return
      const reason = redactConnectionStrings(error instanceof Error ? `${error.name}: ${error.message}` : String(error))
      logger.warn({ reason, retryInMs: nextDelay }, 'MongoDB connection failed; retrying')
      retryTimer = setTimeout(() => void attempt(), nextDelay)
      retryTimer.unref()
      nextDelay = Math.min(nextDelay * 2, maxRetryDelayMs)
    }
  }

  return {
    connection,
    state: () => STATES[connection.readyState] ?? 'disconnected',
    connect: attempt,
    async disconnect() {
      stopped = true
      clearTimeout(retryTimer)
      // close() waits for an in-flight connection attempt to finish (up to serverSelectionTimeoutMS).
      // While still connecting there is nothing to close gracefully, so don't hold up shutdown for it.
      if (connection.readyState === 2) {
        connection.close().catch(() => {})
        return
      }
      await connection.close()
    },
  }
}
