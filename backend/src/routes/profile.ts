import { Router } from 'express'
import { profileController } from '../controllers/profile.js'
import { validate } from '../middleware/validate.js'
import type { ProfileService } from '../services/profile.js'
import { profilePatchBody } from '../validators/profile.js'
import type { AccountRouteGuards } from './auth.js'

/** /api/profile: the signed-in user's own profile. Same rate limit, database and CSRF guards as /api/auth. */
export function createProfileRouter({ profile, guards: { limiter, database, csrf, signedIn } }: { profile: ProfileService; guards: AccountRouteGuards }): Router {
  const router = Router()
  const controller = profileController(profile)

  router.use(limiter, database, signedIn)
  router.get('/', controller.get)
  router.patch('/', csrf, validate({ body: profilePatchBody }), controller.update)
  return router
}
