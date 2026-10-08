import type { Language, UserChanges, UserRecord, UserRepository } from '../repositories/types.js'
import { AppError } from '../utils/AppError.js'

/** What GET/PATCH /api/profile return: the profile fields (null when unset), email and verification. Never hashes or tokens. */
export interface PublicProfile {
  email: string
  emailVerifiedAt: string | null
  displayName: string | null
  targetBand: number | null
  examDate: string | null
  timezone: string | null
  dailyGoalMinutes: number | null
  language: Language | null
}

export const toPublicProfile = ({ email, emailVerifiedAt, profile }: UserRecord): PublicProfile => ({
  email,
  emailVerifiedAt: emailVerifiedAt?.toISOString() ?? null,
  displayName: profile.displayName ?? null,
  targetBand: profile.targetBand ?? null,
  examDate: profile.examDate ?? null,
  timezone: profile.timezone ?? null,
  dailyGoalMinutes: profile.dailyGoalMinutes ?? null,
  language: profile.language ?? null,
})

export interface ProfileService {
  update(userId: string, changes: NonNullable<UserChanges['profile']>): Promise<PublicProfile>
}

export function createProfileService({ users }: { users: UserRepository }): ProfileService {
  return {
    async update(userId, changes) {
      const user = await users.update(userId, { profile: changes })
      // The session was valid a moment ago, so this only happens if the account was deleted meanwhile.
      if (!user) throw new AppError(401, 'unauthenticated', 'Authentication required')
      return toPublicProfile(user)
    },
  }
}
