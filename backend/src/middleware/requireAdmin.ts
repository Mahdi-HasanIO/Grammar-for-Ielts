import type { RequestHandler } from 'express'
import { AppError } from '../utils/AppError.js'
import { getAuth } from './requireAuth.js'

/** After requireAuth: 403 unless the signed-in user's effective role is admin. */
export const requireAdmin: RequestHandler = (_req, res, next) => {
  next(getAuth(res).user.role === 'admin' ? undefined : new AppError(403, 'forbidden', 'Admin access required'))
}
