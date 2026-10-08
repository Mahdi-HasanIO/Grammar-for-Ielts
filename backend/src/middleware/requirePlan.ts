import type { RequestHandler } from 'express'
import type { Plan } from '../repositories/types.js'
import { hasPlan } from '../services/entitlements.js'
import { AppError } from '../utils/AppError.js'
import { getAuth } from './requireAuth.js'

/**
 * After requireAuth: 403 plan_required unless the user's effective plan is
 * at least `plan` (an expired premium plan counts as free). Decided on the
 * server from the stored plan only, never from anything the client sends.
 */
export function requirePlan(plan: Plan, now: () => Date = () => new Date()): RequestHandler {
  return (_req, res, next) => {
    next(hasPlan(getAuth(res).user, plan, now()) ? undefined : new AppError(403, 'plan_required', `This feature needs the ${plan} plan`, { details: { required: plan } }))
  }
}
