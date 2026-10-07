import { z } from 'zod'

/*
 * Environment configuration, validated once at startup. Invalid or missing
 * values stop the server with a readable list of problems. Messages name the
 * variable and the rule, never the value, so secrets such as MONGODB_URI do
 * not end up in logs.
 */

export const LOG_LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] as const

/** Used when CORS_ORIGINS is not set: the Vite dev server and preview, on localhost only. */
export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
] as const

/** An exact origin such as https://grammar-for-ielts.vercel.app: scheme and host, no path, no wildcard. */
function isOrigin(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin === value
  } catch {
    return false
  }
}

const required = (name: string) => ({
  error: (issue: { input: unknown }) => (issue.input === undefined ? `${name} is required` : `${name} must be a string`),
})

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z
    .string(required('MONGODB_URI'))
    .trim()
    .refine((value) => /^mongodb(\+srv)?:\/\/\S+$/.test(value), 'must start with mongodb:// or mongodb+srv://'),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) =>
      value
        ? value
            .split(',')
            .map((origin) => origin.trim())
            .filter(Boolean)
        : [...DEFAULT_CORS_ORIGINS],
    )
    .pipe(
      z.array(
        z.string().refine(isOrigin, 'must be a comma-separated list of origins like https://example.com (no paths, no wildcards)'),
      ),
    ),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
})

export type Env = z.infer<typeof envSchema>

export class EnvError extends Error {
  readonly problems: string[]

  constructor(problems: string[]) {
    super(`Invalid environment configuration:\n${problems.map((p) => `  - ${p}`).join('\n')}`)
    this.name = 'EnvError'
    this.problems = problems
  }
}

/** Parses and validates configuration. Throws EnvError listing every problem. */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = envSchema.safeParse(source)
  if (result.success) return result.data
  throw new EnvError(
    result.error.issues.map((issue) => {
      const name = issue.path.filter((p) => typeof p === 'string').join('.') || 'environment'
      return issue.message.startsWith(name) ? issue.message : `${name}: ${issue.message}`
    }),
  )
}
