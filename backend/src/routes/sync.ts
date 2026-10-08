import { Router, type RequestHandler } from 'express'
import type { z } from 'zod'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated, validate } from '../middleware/validate.js'
import type { SyncService } from '../services/sync.js'

export interface SyncRouteGuards {
  database: RequestHandler
  csrf: RequestHandler
  signedIn: RequestHandler
}

/**
 * GET and PUT for one synced kind, mounted at /api/progress or /api/bookmarks.
 * `field` names the data in request and response bodies ("progress", "bookmarks").
 */
export function createSyncRouter<T>({
  field,
  service,
  body,
  guards: { database, csrf, signedIn },
}: {
  field: string
  service: SyncService<T>
  body: z.ZodType<{ baseVersion: number } & Record<string, unknown>>
  guards: SyncRouteGuards
}): Router {
  const router = Router()
  router.use(database, signedIn)

  router.get('/', async (_req, res) => {
    const { data, version, updatedAt } = await service.get(getAuth(res).user.id)
    res.status(200).json({ [field]: data, version, updatedAt: updatedAt?.toISOString() ?? null })
  })

  router.put('/', csrf, validate({ body }), async (_req, res) => {
    const parsed = getValidated<{ body: typeof body }>(res).body
    const result = await service.put(getAuth(res).user.id, parsed.baseVersion, parsed[field] as T)
    res.status(200).json({ [field]: result.data, version: result.version, updatedAt: result.updatedAt?.toISOString() ?? null, merged: result.merged })
  })
  return router
}
