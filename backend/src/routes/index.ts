import { Router } from 'express'
import { liveness, readiness } from '../controllers/health.js'
import type { DatabaseStatus } from '../services/database.js'
import { createAuthRouter, type AuthRouterOptions } from './auth.js'

export interface ApiRouterOptions {
  db: DatabaseStatus
  auth: AuthRouterOptions
}

/** Everything under /api. Feature routers are added here as later phases introduce them. */
export function createApiRouter({ db, auth }: ApiRouterOptions): Router {
  const router = Router()
  router.get('/health', liveness)
  router.get('/health/ready', readiness(db))
  router.use('/auth', createAuthRouter(auth))
  return router
}
