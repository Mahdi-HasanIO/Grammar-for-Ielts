import type { RequestHandler } from 'express'
import { getAuth } from '../middleware/requireAuth.js'
import { getValidated } from '../middleware/validate.js'
import { toPublicProfile, type ProfileService } from '../services/profile.js'
import type { profilePatchBody } from '../validators/profile.js'

export function profileController(profile: ProfileService) {
  const get: RequestHandler = (_req, res) => {
    res.status(200).json({ profile: toPublicProfile(getAuth(res).user) })
  }

  const update: RequestHandler = async (_req, res) => {
    const changes = getValidated<{ body: typeof profilePatchBody }>(res).body
    res.status(200).json({ profile: await profile.update(getAuth(res).user.id, changes) })
  }

  return { get, update }
}
