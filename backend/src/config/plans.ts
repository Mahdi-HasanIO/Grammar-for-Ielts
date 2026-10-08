import type { Plan } from '../repositories/types.js'
import type { Env } from './env.js'

/*
 * What each plan allows. Limits are numbers (per UTC day); features are
 * flags for requirePlan-style checks. Defaults come from env so they can be
 * tuned per deployment without a code change.
 */
export interface PlanLimits {
  /** AI requests per UTC day. */
  aiDailyRequests: number
}

export type PlanLimitTable = Record<Plan, PlanLimits>

/** Order of plans, lowest first: requirePlan('premium') also admits any higher plan added later. */
export const PLAN_RANK: Record<Plan, number> = { free: 0, premium: 1 }

export function planLimitsFromEnv(env: Pick<Env, 'AI_DAILY_QUOTA' | 'AI_DAILY_QUOTA_PREMIUM'>): PlanLimitTable {
  return {
    free: { aiDailyRequests: env.AI_DAILY_QUOTA },
    premium: { aiDailyRequests: env.AI_DAILY_QUOTA_PREMIUM },
  }
}
