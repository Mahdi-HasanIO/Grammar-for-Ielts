import { Router, type RequestHandler } from 'express'
import { z } from 'zod'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated, validate } from '../middleware/validate.js'
import { actorOf, ADMIN_COLLECTIONS, type AdminContentService } from '../services/adminContent.js'

const collectionParams = z.object({ collection: z.enum(ADMIN_COLLECTIONS) })
const documentParams = collectionParams.extend({ key: z.string().min(1).max(200) })
/** Any JSON: the collection's own schema checks it in the service, which knows which one applies. */
const anyDocument = z.unknown()
const auditQuery = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  before: z.iso.datetime().optional(),
})

export interface AdminRouteGuards {
  database: RequestHandler
  csrf: RequestHandler
  signedIn: RequestHandler
}

/**
 * /api/admin: content CRUD and the audit log. Signed in (401) and admin (403)
 * on every route; writes also need JSON from an allowed origin. Admin is
 * granted only by the grant-admin script or ADMIN_EMAILS, never through the API.
 */
export function createAdminRouter({ admin, guards: { database, csrf, signedIn } }: { admin: AdminContentService; guards: AdminRouteGuards }): Router {
  const router = Router()
  router.use(database, signedIn, requireAdmin)

  router.get('/content/:collection', validate({ params: collectionParams }), async (_req, res) => {
    const { collection } = getValidated<{ params: typeof collectionParams }>(res).params
    res.json({ documents: await admin.list(collection) })
  })

  router.get('/content/:collection/:key', validate({ params: documentParams }), async (_req, res) => {
    const { collection, key } = getValidated<{ params: typeof documentParams }>(res).params
    res.json({ document: await admin.get(collection, key) })
  })

  router.put('/content/:collection/:key', csrf, validate({ params: documentParams, body: anyDocument }), async (_req, res) => {
    const { params, body } = getValidated<{ params: typeof documentParams; body: typeof anyDocument }>(res)
    const { document, created } = await admin.put(params.collection, params.key, body, actorOf(getAuth(res).user))
    res.status(created ? 201 : 200).json({ document })
  })

  router.delete('/content/:collection/:key', csrf, validate({ params: documentParams }), async (_req, res) => {
    const { collection, key } = getValidated<{ params: typeof documentParams }>(res).params
    await admin.remove(collection, key, actorOf(getAuth(res).user))
    res.status(204).end()
  })

  router.get('/audit', validate({ query: auditQuery }), async (_req, res) => {
    const { limit, before } = getValidated<{ query: typeof auditQuery }>(res).query
    res.json({ entries: await admin.audit({ limit, before: before ? new Date(before) : undefined }) })
  })
  return router
}
