import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/* Static checks of the production security headers in vercel.json. */

const ROOT = path.resolve(__dirname, '../..')
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')) as {
  headers: { source: string; headers: { key: string; value: string }[] }[]
}
const all = vercel.headers.find((h) => h.source === '/(.*)')!
const header = (key: string) => all.headers.find((h) => h.key === key)?.value
const csp = Object.fromEntries(
  header('Content-Security-Policy')!
    .split(';')
    .map((d) => d.trim().split(/\s+/))
    .map(([name, ...values]) => [name, values]),
) as Record<string, string[]>

describe('security headers on every response', () => {
  it('applies to every path', () => {
    expect(all).toBeDefined()
  })

  it.each([
    ['Strict-Transport-Security', 'max-age=63072000'],
    ['X-Content-Type-Options', 'nosniff'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['X-Frame-Options', 'DENY'],
  ])('%s: %s', (key, value) => {
    expect(header(key)).toBe(value)
  })

  it('disables device features the app never uses, but keeps clipboard and Web Share for the share card', () => {
    const policy = header('Permissions-Policy')!
    for (const feature of ['camera', 'microphone', 'geolocation', 'payment', 'usb', 'browsing-topics']) {
      expect(policy).toContain(`${feature}=()`)
    }
    expect(policy).not.toMatch(/clipboard-write|web-share/)
  })

  it('keeps the existing caching and service-worker headers', () => {
    const rule = (source: string) => vercel.headers.find((h) => h.source === source)?.headers
    expect(rule('/assets/(.*)')).toEqual([{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }])
    expect(rule('/sw.js')).toContainEqual({ key: 'Service-Worker-Allowed', value: '/' })
    expect(rule('/offline-manifest.json')).toEqual([{ key: 'Cache-Control', value: 'no-cache' }])
  })
})

describe('Content-Security-Policy', () => {
  it('allows scripts only from this origin and the inline theme script, by hash', () => {
    const themeScript = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').match(/<script>([\s\S]*?)<\/script>/)![1]
    const hash = `'sha256-${crypto.createHash('sha256').update(themeScript, 'utf8').digest('base64')}'`
    expect(csp['script-src']).toEqual(["'self'", hash])
  })

  it('never allows unsafe script execution', () => {
    for (const directive of ['default-src', 'script-src']) {
      expect(csp[directive]).not.toContain("'unsafe-inline'")
      expect(csp[directive]).not.toContain("'unsafe-eval'")
    }
  })

  it('locks down plugins, base URLs, framing and form targets', () => {
    expect(csp['default-src']).toEqual(["'self'"])
    expect(csp['object-src']).toEqual(["'none'"])
    expect(csp['base-uri']).toEqual(["'none'"])
    expect(csp['frame-ancestors']).toEqual(["'none'"])
    expect(csp['form-action']).toEqual(["'self'"])
  })

  it('allows inline style attributes but not inline <style> elements (where browsers support the split)', () => {
    expect(csp['style-src-attr']).toEqual(["'unsafe-inline'"])
    expect(csp['style-src-elem']).toEqual(["'self'", 'https://fonts.googleapis.com'])
    // Fallback for browsers without style-src-attr/-elem (CSP Level 3).
    expect(csp['style-src']).toEqual(["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'])
  })

  it('allows exactly the external services the app uses', () => {
    expect(csp['connect-src']).toEqual([
      "'self'",
      'https://generativelanguage.googleapis.com', // AI practice (Gemini)
      'https://abacus.jasoncameron.dev', // visitor counter
      'https://fonts.googleapis.com', // Offline Mode caches the font stylesheet
      'https://fonts.gstatic.com', // ...and the font files
    ])
    expect(csp['font-src']).toEqual(['https://fonts.gstatic.com'])
    expect(csp['img-src']).toEqual(["'self'"])
    expect(csp['worker-src']).toEqual(["'self'"])
    expect(csp['manifest-src']).toEqual(["'self'"])
  })
})
