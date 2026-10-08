import { PLAN_RANK, type PlanLimits, type PlanLimitTable } from '../config/plans.js'
import type { AuditLogRepository, Plan, UsageRepository, UserRecord, UserRepository } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'
import { AI_METRIC } from './ai/service.js'

/** The plan the user has right now: a premium plan past its end date counts as free. */
export function effectivePlan(user: Pick<UserRecord, 'plan' | 'planExpiresAt'>, now: Date): Plan {
  if (user.plan !== 'free' && user.planExpiresAt && user.planExpiresAt.getTime() <= now.getTime()) return 'free'
  return user.plan
}

export const hasPlan = (user: Pick<UserRecord, 'plan' | 'planExpiresAt'>, required: Plan, now: Date) => PLAN_RANK[effectivePlan(user, now)] >= PLAN_RANK[required]

export interface Entitlements {
  plan: Plan
  planExpiresAt: string | null
  limits: PlanLimits
  usage: { aiRequests: { used: number; limit: number; resetsAt: string } }
}

export interface EntitlementsService {
  limitsFor(user: UserRecord): PlanLimits
  summary(user: UserRecord): Promise<Entitlements>
  /** Admin only. Sets the stored plan (and optional end date) and records it in the audit log. */
  grantPlan(actor: { id: string; email: string }, userId: string, plan: Plan, expiresAt: Date | null): Promise<UserRecord>
  /** Admin only: find an account to grant a plan to. */
  findUserByEmail(email: string): Promise<UserRecord | null>
}

export function createEntitlementsService({
  limits,
  usage,
  users,
  audit,
  now = () => new Date(),
}: {
  limits: PlanLimitTable
  usage: UsageRepository
  users: UserRepository
  audit: AuditLogRepository
  now?: () => Date
}): EntitlementsService {
  const limitsFor = (user: UserRecord) => limits[effectivePlan(user, now())]

  return {
    limitsFor,

    async summary(user) {
      const at = now()
      const day = at.toISOString().slice(0, 10)
      const plan = effectivePlan(user, at)
      return {
        plan,
        planExpiresAt: plan === 'free' ? null : (user.planExpiresAt?.toISOString() ?? null),
        limits: limits[plan],
        usage: {
          aiRequests: {
            used: await usage.get(user.id, AI_METRIC, day),
            limit: limits[plan].aiDailyRequests,
            resetsAt: new Date(Date.parse(`${day}T00:00:00Z`) + 86_400_000).toISOString(),
          },
        },
      }
    },

    async grantPlan(actor, userId, plan, expiresAt) {
      if (expiresAt && expiresAt.getTime() <= now().getTime()) throw new AppError(400, 'invalid_expiry', 'expiresAt must be in the future')
      const before = await users.findById(userId)
      if (!before) throw new AppError(404, 'not_found', 'User not found')
      const after = await users.update(userId, { plan, planExpiresAt: plan === 'free' ? null : expiresAt })
      if (!after) throw new AppError(404, 'not_found', 'User not found')
      await audit.append({
        at: now(),
        actor: { type: 'user', id: actor.id, email: actor.email },
        action: 'grant_plan',
        target: { collection: 'users', key: userId },
        before: { plan: before.plan, planExpiresAt: before.planExpiresAt },
        after: { plan: after.plan, planExpiresAt: after.planExpiresAt },
      })
      return after
    },

    findUserByEmail: (email) => users.findByEmail(email),
  }
}
