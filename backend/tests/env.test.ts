import { describe, expect, it } from 'vitest'
import { DEFAULT_CORS_ORIGINS, EnvError, loadEnv } from '../src/config/env.js'

const VALID = { MONGODB_URI: 'mongodb://127.0.0.1:27017/grammar-for-ielts' }

function problemsFor(source: Record<string, string | undefined>): string[] {
  try {
    loadEnv(source)
  } catch (error) {
    expect(error).toBeInstanceOf(EnvError)
    return (error as EnvError).problems
  }
  throw new Error('expected loadEnv to throw')
}

const MONGO_AND_PROXY_DEFAULTS = {
  GEMINI_MODEL: 'gemini-3.5-flash-lite',
  GEMINI_TIMEOUT_MS: 30000,
  AI_RATE_LIMIT_PER_MINUTE: 10,
  AI_DAILY_QUOTA: 20,
  TRUST_PROXY: 0,
  MONGODB_MAX_POOL_SIZE: 10,
  MONGODB_MIN_POOL_SIZE: 0,
  MONGODB_SERVER_SELECTION_TIMEOUT_MS: 5000,
  MONGODB_CONNECT_TIMEOUT_MS: 10000,
  MONGODB_SOCKET_TIMEOUT_MS: 45000,
}

describe('loadEnv', () => {
  it('applies defaults when only MONGODB_URI is set', () => {
    expect(loadEnv(VALID)).toEqual({
      NODE_ENV: 'development',
      PORT: 4000,
      MONGODB_URI: VALID.MONGODB_URI,
      CORS_ORIGINS: [...DEFAULT_CORS_ORIGINS],
      LOG_LEVEL: 'info',
      SESSION_COOKIE_NAME: 'gfi_session',
      APP_BASE_URL: 'http://localhost:5173',
      MAIL_TRANSPORT: 'log',
      ADMIN_EMAILS: [],
      ...MONGO_AND_PROXY_DEFAULTS,
    })
  })

  it('defaults CORS to localhost dev origins only', () => {
    for (const origin of loadEnv(VALID).CORS_ORIGINS) expect(new URL(origin).hostname).toMatch(/^(localhost|127\.0\.0\.1)$/)
  })

  it('parses every variable', () => {
    expect(
      loadEnv({
        NODE_ENV: 'production',
        PORT: '8080',
        MONGODB_URI: 'mongodb+srv://user:pass@cluster0.example.mongodb.net/app',
        CORS_ORIGINS: 'https://grammar-for-ielts.vercel.app, http://localhost:5173',
        LOG_LEVEL: 'warn',
        SESSION_COOKIE_NAME: '__Host-gfi_session',
        APP_BASE_URL: 'https://grammar-for-ielts.vercel.app/',
        MAIL_TRANSPORT: 'resend',
        MAIL_FROM: 'Grammar for IELTS <no-reply@example.com>',
        RESEND_API_KEY: 're_test_key',
        TRUST_PROXY: '1',
        GEMINI_API_KEY: 'test-key',
        GEMINI_MODEL: 'gemini-flash-latest',
        GEMINI_TIMEOUT_MS: '15000',
        AI_RATE_LIMIT_PER_MINUTE: '5',
        AI_DAILY_QUOTA: '50',
        ADMIN_EMAILS: ' Owner@Example.com, ops@example.com ',
        MONGODB_MAX_POOL_SIZE: '20',
        MONGODB_MIN_POOL_SIZE: '2',
        MONGODB_SERVER_SELECTION_TIMEOUT_MS: '3000',
        MONGODB_CONNECT_TIMEOUT_MS: '8000',
        MONGODB_SOCKET_TIMEOUT_MS: '0',
      }),
    ).toEqual({
      NODE_ENV: 'production',
      PORT: 8080,
      MONGODB_URI: 'mongodb+srv://user:pass@cluster0.example.mongodb.net/app',
      CORS_ORIGINS: ['https://grammar-for-ielts.vercel.app', 'http://localhost:5173'],
      LOG_LEVEL: 'warn',
      SESSION_COOKIE_NAME: '__Host-gfi_session',
      APP_BASE_URL: 'https://grammar-for-ielts.vercel.app',
      MAIL_TRANSPORT: 'resend',
      MAIL_FROM: 'Grammar for IELTS <no-reply@example.com>',
      RESEND_API_KEY: 're_test_key',
      TRUST_PROXY: 1,
      GEMINI_API_KEY: 'test-key',
      GEMINI_MODEL: 'gemini-flash-latest',
      GEMINI_TIMEOUT_MS: 15000,
      AI_RATE_LIMIT_PER_MINUTE: 5,
      AI_DAILY_QUOTA: 50,
      ADMIN_EMAILS: ['owner@example.com', 'ops@example.com'],
      MONGODB_MAX_POOL_SIZE: 20,
      MONGODB_MIN_POOL_SIZE: 2,
      MONGODB_SERVER_SELECTION_TIMEOUT_MS: 3000,
      MONGODB_CONNECT_TIMEOUT_MS: 8000,
      MONGODB_SOCKET_TIMEOUT_MS: 0,
    })
  })

  it('rejects a missing MONGODB_URI', () => {
    expect(problemsFor({})).toEqual(['MONGODB_URI is required'])
  })

  it.each([
    [{ ...VALID, MONGODB_URI: 'postgres://u:p@h/db' }, 'MONGODB_URI: must start with mongodb:// or mongodb+srv://'],
    [{ ...VALID, MONGODB_URI: '   ' }, 'MONGODB_URI: must start with mongodb:// or mongodb+srv://'],
    [{ ...VALID, PORT: 'abc' }, 'PORT'],
    [{ ...VALID, PORT: '0' }, 'PORT'],
    [{ ...VALID, PORT: '70000' }, 'PORT'],
    [{ ...VALID, PORT: '80.5' }, 'PORT'],
    [{ ...VALID, NODE_ENV: 'staging' }, 'NODE_ENV'],
    [{ ...VALID, SESSION_COOKIE_NAME: 'my session' }, 'SESSION_COOKIE_NAME'],
    [{ ...VALID, APP_BASE_URL: 'ftp://example.com' }, 'APP_BASE_URL'],
    [{ ...VALID, APP_BASE_URL: 'https://example.com/?x=1' }, 'APP_BASE_URL'],
    [{ ...VALID, NODE_ENV: 'production' }, 'APP_BASE_URL is required when NODE_ENV=production'],
    [{ ...VALID, MAIL_TRANSPORT: 'smtp' }, 'MAIL_TRANSPORT'],
    [{ ...VALID, TRUST_PROXY: 'true' }, 'TRUST_PROXY'],
    [{ ...VALID, GEMINI_MODEL: 'models/../../x' }, 'GEMINI_MODEL'],
    [{ ...VALID, AI_DAILY_QUOTA: '-1' }, 'AI_DAILY_QUOTA'],
    [{ ...VALID, ADMIN_EMAILS: 'owner@example.com,not-an-email' }, 'ADMIN_EMAILS'],
    [{ ...VALID, TRUST_PROXY: '11' }, 'TRUST_PROXY'],
    [{ ...VALID, MONGODB_MAX_POOL_SIZE: '0' }, 'MONGODB_MAX_POOL_SIZE'],
    [{ ...VALID, MONGODB_MIN_POOL_SIZE: '5', MONGODB_MAX_POOL_SIZE: '4' }, 'MONGODB_MIN_POOL_SIZE must not exceed MONGODB_MAX_POOL_SIZE'],
    [{ ...VALID, MONGODB_SERVER_SELECTION_TIMEOUT_MS: '10' }, 'MONGODB_SERVER_SELECTION_TIMEOUT_MS'],
    [{ ...VALID, MAIL_TRANSPORT: 'resend', MAIL_FROM: 'a@b.co' }, 'RESEND_API_KEY is required when MAIL_TRANSPORT=resend'],
    [{ ...VALID, MAIL_TRANSPORT: 'resend', RESEND_API_KEY: 'k' }, 'MAIL_FROM is required when MAIL_TRANSPORT=resend'],
    [{ ...VALID, SESSION_COOKIE_NAME: 'a=b;' }, 'SESSION_COOKIE_NAME'],
    [{ ...VALID, LOG_LEVEL: 'verbose' }, 'LOG_LEVEL'],
    [{ ...VALID, CORS_ORIGINS: '*' }, 'CORS_ORIGINS'],
    [{ ...VALID, CORS_ORIGINS: 'https://ok.example.com,https://bad.example.com/path' }, 'CORS_ORIGINS'],
    [{ ...VALID, CORS_ORIGINS: 'example.com' }, 'CORS_ORIGINS'],
  ])('rejects %j', (source, expected) => {
    const problems = problemsFor(source)
    expect(problems.some((p) => p.startsWith(expected))).toBe(true)
  })

  it('reports every problem at once', () => {
    const problems = problemsFor({ PORT: 'abc', LOG_LEVEL: 'loud' })
    expect(problems.map((p) => p.split(/[: ]/)[0]).sort()).toEqual(['LOG_LEVEL', 'MONGODB_URI', 'PORT'])
  })

  it('never includes the rejected value in the error message', () => {
    const problems = problemsFor({ MONGODB_URI: 'postgres://admin:TopSecret123@db.internal/app' })
    expect(problems.join('\n')).not.toContain('TopSecret123')
  })
})
