import type { Server } from 'node:http'
import { createApp } from './app.js'
import { EnvError, loadEnv, type Env } from './config/env.js'
import { createLogger } from './config/logger.js'
import { createMongoRepositories } from './repositories/mongo.js'
import { createAccountService } from './services/account.js'
import { createAuthService } from './services/auth.js'
import { createDatabase } from './services/database.js'
import { createMailer } from './services/mailer.js'
import { createArgon2Hasher } from './services/password.js'
import { createProfileService } from './services/profile.js'

const SHUTDOWN_TIMEOUT_MS = 10_000

/** Loads backend/.env into process.env if it exists. Variables already set in the environment win. */
function loadDotEnv(): void {
  try {
    process.loadEnvFile()
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

function readConfig(): Env {
  try {
    return loadEnv()
  } catch (error) {
    if (error instanceof EnvError) {
      // Fail fast on invalid configuration. The message lists variable names and rules, never values.
      console.error(error.message)
      process.exit(1)
    }
    throw error
  }
}

async function main(): Promise<void> {
  loadDotEnv()
  const env = readConfig()
  const logger = createLogger(env)
  const db = createDatabase({
    uri: env.MONGODB_URI,
    logger,
    maxPoolSize: env.MONGODB_MAX_POOL_SIZE,
    minPoolSize: env.MONGODB_MIN_POOL_SIZE,
    serverSelectionTimeoutMS: env.MONGODB_SERVER_SELECTION_TIMEOUT_MS,
    connectTimeoutMS: env.MONGODB_CONNECT_TIMEOUT_MS,
    socketTimeoutMS: env.MONGODB_SOCKET_TIMEOUT_MS,
  })
  const repositories = createMongoRepositories(db.connection)
  const hasher = createArgon2Hasher()
  const auth = createAuthService({ repositories, hasher })
  const account = createAccountService({ repositories, hasher, mailer: createMailer(env, logger), logger, appBaseUrl: env.APP_BASE_URL })
  const profile = createProfileService(repositories)
  const app = createApp({ env, db, auth, account, profile, logger })
  logger.info({ mailTransport: env.MAIL_TRANSPORT }, 'Mail transport selected')

  const server: Server = app.listen(env.PORT, (error?: Error) => {
    if (error) {
      logger.fatal({ err: error }, 'Server failed to start')
      process.exit(1)
    }
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'API listening')
  })

  // The API serves /api/health even while MongoDB is unreachable; the database retries in the background.
  void db.connect()

  let shuttingDown = false
  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (shuttingDown) return
    shuttingDown = true
    logger.info({ signal }, 'Shutting down')
    setTimeout(() => {
      logger.error('Shutdown timed out; exiting')
      process.exit(1)
    }, SHUTDOWN_TIMEOUT_MS).unref()

    // Stop accepting connections and let in-flight requests finish, then close the database.
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await db.disconnect()
    logger.info('Shutdown complete')
    process.exit(0)
  }
  process.on('SIGTERM', (signal) => void shutdown(signal))
  process.on('SIGINT', (signal) => void shutdown(signal))
}

void main()
