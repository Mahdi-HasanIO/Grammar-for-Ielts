import type { RequestHandler } from 'express'
import type { DatabaseStatus } from '../services/database.js'
import { serviceUnavailable } from './errorHandler.js'

/**
 * For routes that need MongoDB: answers 503 service_unavailable while the
 * database is not connected, instead of letting the query fail with a 500.
 * Queries fail fast anyway (bufferCommands is off), so this only makes the
 * response accurate. The server keeps reconnecting in the background.
 */
export function requireDatabase(db: DatabaseStatus): RequestHandler {
  return (_req, _res, next) => {
    next(db.state() === 'connected' ? undefined : serviceUnavailable())
  }
}
