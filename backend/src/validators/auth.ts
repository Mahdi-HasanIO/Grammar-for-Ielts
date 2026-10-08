import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 10
export const PASSWORD_MAX_LENGTH = 128

/** Trimmed and lowercased before validation and storage, so " User@Example.COM " and "user@example.com" are one account. */
const email = z
  .string('email is required')
  .trim()
  .toLowerCase()
  .max(254, 'email must be at most 254 characters')
  .pipe(z.email('email must be a valid email address'))

/** Not trimmed: spaces are allowed and significant. The maximum keeps hashing cost bounded. */
const password = z
  .string('password is required')
  .min(PASSWORD_MIN_LENGTH, `password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `password must be at most ${PASSWORD_MAX_LENGTH} characters`)

/** Body for POST /api/auth/register and POST /api/auth/login. Unknown fields are dropped. */
export const credentialsBody = z.object({ email, password })
