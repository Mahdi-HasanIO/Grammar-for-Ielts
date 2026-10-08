import { z } from 'zod'
import { LANGUAGES } from '../repositories/types.js'

/**
 * IANA names only (Asia/Dhaka, UTC): no offsets like +06:00. Returns the name
 * to store, or null if the runtime does not know it. The user's spelling is
 * kept (ICU would turn Asia/Kolkata into the legacy Asia/Calcutta); only the
 * letter case is fixed when it differs from the resolved name (asia/dhaka).
 */
export function canonicalTimeZone(value: string): string | null {
  if (!/^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+)*$/.test(value)) return null
  try {
    const resolved = new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone
    return resolved.toLowerCase() === value.toLowerCase() ? resolved : value
  } catch {
    return null
  }
}

const displayName = z
  .string('displayName must be a string')
  .trim()
  .min(1, 'displayName must be 1 to 50 characters')
  .max(50, 'displayName must be 1 to 50 characters')

const targetBand = z
  .number('targetBand must be a number')
  .min(4, 'targetBand must be between 4.0 and 9.0')
  .max(9, 'targetBand must be between 4.0 and 9.0')
  .refine((band) => Number.isInteger(band * 2), 'targetBand must be in steps of 0.5')

const examDate = z.iso.date('examDate must be a date like 2026-12-31')

const timezone = z
  .string('timezone must be a string')
  .transform((value, ctx) => {
    const zone = canonicalTimeZone(value)
    if (zone) return zone
    ctx.addIssue({ code: 'custom', message: 'timezone must be an IANA time zone name like Asia/Dhaka' })
    return z.NEVER
  })

const dailyGoalMinutes = z
  .number('dailyGoalMinutes must be a number')
  .int('dailyGoalMinutes must be a whole number')
  .min(1, 'dailyGoalMinutes must be between 1 and 600')
  .max(600, 'dailyGoalMinutes must be between 1 and 600')

const language = z.enum(LANGUAGES, 'language must be "en" or "bn"')

/**
 * Body for PATCH /api/profile. Every field is optional; null clears it.
 * Unknown fields are rejected (strict), so typos do not silently do nothing.
 */
export const profilePatchBody = z
  .strictObject({
    displayName: displayName.nullable(),
    targetBand: targetBand.nullable(),
    examDate: examDate.nullable(),
    timezone: timezone.nullable(),
    dailyGoalMinutes: dailyGoalMinutes.nullable(),
    language: language.nullable(),
  })
  .partial()
  .refine((body) => Object.keys(body).length > 0, 'at least one profile field is required')
