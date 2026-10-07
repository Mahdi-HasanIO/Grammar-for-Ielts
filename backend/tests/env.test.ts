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

describe('loadEnv', () => {
  it('applies defaults when only MONGODB_URI is set', () => {
    expect(loadEnv(VALID)).toEqual({
      NODE_ENV: 'development',
      PORT: 4000,
      MONGODB_URI: VALID.MONGODB_URI,
      CORS_ORIGINS: [...DEFAULT_CORS_ORIGINS],
      LOG_LEVEL: 'info',
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
      }),
    ).toEqual({
      NODE_ENV: 'production',
      PORT: 8080,
      MONGODB_URI: 'mongodb+srv://user:pass@cluster0.example.mongodb.net/app',
      CORS_ORIGINS: ['https://grammar-for-ielts.vercel.app', 'http://localhost:5173'],
      LOG_LEVEL: 'warn',
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
