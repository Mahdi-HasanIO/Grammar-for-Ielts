import type { RequestHandler } from 'express'
import type { DatabaseStatus } from '../services/database.js'

/** Liveness: the process is up and serving. Never touches the database. */
export const liveness: RequestHandler = (_req, res) => {
  res.status(200).json({ status: 'ok' })
}

/** Readiness: 200 when MongoDB is connected, 503 otherwise, so traffic is only routed to a usable instance. */
export function readiness(db: DatabaseStatus): RequestHandler {
  return (_req, res) => {
    const state = db.state()
    if (state === 'connected') {
      res.status(200).json({ status: 'ok', database: state })
    } else {
      res.status(503).json({ status: 'unavailable', database: state })
    }
  }
}
