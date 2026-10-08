import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 10
export const PASSWORD_MAX_LENGTH = 128

/** Trimmed and lowercased before validation and storage, so " User@Example.COM " and "user@example.com" are one account. */
export const email = z
  .string('email is required')
  .trim()
  .toLowerCase()
  .max(254, 'email must be at most 254 characters')
  .pipe(z.email('email must be a valid email address'))

/** Not trimmed: spaces are allowed and significant. The maximum keeps hashing cost bounded. */
export const password = z
  .string('password is required')
  .min(PASSWORD_MIN_LENGTH, `password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `password must be at most ${PASSWORD_MAX_LENGTH} characters`)

/** Body for POST /api/auth/register and POST /api/auth/login. Unknown fields are dropped. */
export const credentialsBody = z.object({ email, password })

/** Body for POST /api/auth/forgot-password. */
export const forgotPasswordBody = z.object({ email })

/** A one-time token from an email link. Its format is checked by the service, which answers invalid_token. */
const token = z.string('token is required').min(1, 'token is required').max(200, 'token is too long')

/** Body for POST /api/auth/reset-password. */
export const resetPasswordBody = z.object({ token, password })

/** Body for POST /api/auth/verify-email. */
export const verifyEmailBody = z.object({ token })

/** Body for POST /api/auth/change-password. The current password is only checked, so only its length is bounded. */
export const changePasswordBody = z.object({
  currentPassword: z
    .string('currentPassword is required')
    .min(1, 'currentPassword is required')
    .max(PASSWORD_MAX_LENGTH, `currentPassword must be at most ${PASSWORD_MAX_LENGTH} characters`),
  newPassword: z
    .string('newPassword is required')
    .min(PASSWORD_MIN_LENGTH, `newPassword must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `newPassword must be at most ${PASSWORD_MAX_LENGTH} characters`),
})
