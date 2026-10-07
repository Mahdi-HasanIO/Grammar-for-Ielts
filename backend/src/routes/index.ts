import { Router } from 'express'
import { liveness, readiness } from '../controllers/health.js'
import type { DatabaseStatus } from '../services/database.js'

/** Everything under /api. Feature routers are added here as later phases introduce them. */
export function createApiRouter({ db }: { db: DatabaseStatus }): Router {
  const router = Router()
  router.get('/health', liveness)
  router.get('/health/ready', readiness(db))
  return router
}
