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

/** Characters allowed in a cookie name (an RFC 6265 token). */
const COOKIE_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/

/** An http(s) URL without query or fragment, e.g. https://grammar-for-ielts.vercel.app. A trailing slash is dropped. */
function isBaseUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && !url.search && !url.hash && !url.username && !url.password
  } catch {
    return false
  }
}

export const MAIL_TRANSPORTS = ['log', 'resend'] as const

/** Links in emails point at the Vite dev server unless APP_BASE_URL is set. */
export const DEFAULT_APP_BASE_URL = 'http://localhost:5173'

const required = (name: string) => ({
  error: (issue: { input: unknown }) => (issue.input === undefined ? `${name} is required` : `${name} must be a string`),
})

const envSchema = z
  .object({
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
  // Number of reverse proxies in front of the API (0 = none, the default). Set it to the real count on
  // the host (often 1) so req.ip, and so the per-IP rate limits, use X-Forwarded-For. Too high lets
  // clients spoof their IP; never "true".
  TRUST_PROXY: z.coerce.number().int().min(0).max(10).default(0),
  // MongoDB driver pool and timeouts (milliseconds).
  MONGODB_MAX_POOL_SIZE: z.coerce.number().int().min(1).max(500).default(10),
  MONGODB_MIN_POOL_SIZE: z.coerce.number().int().min(0).max(500).default(0),
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: z.coerce.number().int().min(500).max(120_000).default(5_000),
  MONGODB_CONNECT_TIMEOUT_MS: z.coerce.number().int().min(500).max(120_000).default(10_000),
  MONGODB_SOCKET_TIMEOUT_MS: z.coerce.number().int().min(0).max(600_000).default(45_000),
  // In production over HTTPS, a `__Host-` prefix (e.g. __Host-gfi_session) makes browsers enforce Secure, path=/ and no Domain.
  SESSION_COOKIE_NAME: z.string().trim().regex(COOKIE_NAME, 'must be a cookie name (letters, digits and !#$%&\'*+-.^_`|~)').default('gfi_session'),
  // Where the frontend lives: links in emails point here. Required in production.
  APP_BASE_URL: z
    .string()
    .trim()
    .refine(isBaseUrl, 'must be an http(s) URL without query or fragment, like https://example.com')
    .transform((value) => value.replace(/\/+$/, ''))
    .optional(),
  // Comma-separated emails that are admins once verified (in addition to roles granted by the grant-admin script).
  ADMIN_EMAILS: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    )
    .pipe(z.array(z.email('must be a comma-separated list of email addresses'))),
  // Server-side AI (Gemini). Without a key the /api/ai routes answer 503.
  GEMINI_API_KEY: z.string().trim().min(1).optional(),
  // A model ID from https://ai.google.dev/gemini-api/docs/models. Default: the stable, cost-efficient Flash-Lite.
  GEMINI_MODEL: z.string().trim().regex(/^[a-z0-9][a-z0-9.-]{1,80}$/, 'must be a Gemini model ID like gemini-3.5-flash-lite').default('gemini-3.5-flash-lite'),
  GEMINI_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(30_000),
  // Per user: requests per minute, and the daily AI quota for each plan.
  AI_RATE_LIMIT_PER_MINUTE: z.coerce.number().int().min(1).max(600).default(10),
  AI_DAILY_QUOTA: z.coerce.number().int().min(0).max(100_000).default(20),
  // log: write emails to the log (content only outside production). resend: send through the Resend API.
  MAIL_TRANSPORT: z.enum(MAIL_TRANSPORTS).default('log'),
  MAIL_FROM: z.string().trim().min(3).optional(),
  RESEND_API_KEY: z.string().trim().min(1).optional(),
})
  .superRefine((env, ctx) => {
    if (env.MONGODB_MIN_POOL_SIZE > env.MONGODB_MAX_POOL_SIZE) {
      ctx.addIssue({ code: 'custom', path: ['MONGODB_MIN_POOL_SIZE'], message: 'MONGODB_MIN_POOL_SIZE must not exceed MONGODB_MAX_POOL_SIZE' })
    }
    if (env.NODE_ENV === 'production' && !env.APP_BASE_URL) {
      ctx.addIssue({ code: 'custom', path: ['APP_BASE_URL'], message: 'APP_BASE_URL is required when NODE_ENV=production' })
    }
    if (env.MAIL_TRANSPORT === 'resend') {
      if (!env.RESEND_API_KEY) ctx.addIssue({ code: 'custom', path: ['RESEND_API_KEY'], message: 'RESEND_API_KEY is required when MAIL_TRANSPORT=resend' })
      if (!env.MAIL_FROM) ctx.addIssue({ code: 'custom', path: ['MAIL_FROM'], message: 'MAIL_FROM is required when MAIL_TRANSPORT=resend' })
    }
  })
  .transform((env) => ({ ...env, APP_BASE_URL: env.APP_BASE_URL ?? DEFAULT_APP_BASE_URL }))

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
