/*
 * Build-time check of the Content-Security-Policy in vercel.json.
 *
 * The CSP allows inline scripts only by hash. The single inline script is the
 * theme script in index.html, which every prerendered page and app.html
 * inherit. If that script changes, its hash changes, and browsers would
 * block it in production (dark-mode flash, missing `js` class). This check
 * fails the build instead, and prints the hash to put in vercel.json.
 *
 * It also fails when an allowed hash no longer matches any script (stale
 * allowance), or when script-src is loosened with 'unsafe-inline' or
 * 'unsafe-eval'. JSON-LD blocks (type="application/ld+json") are data, not
 * scripts, so CSP does not apply to them.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const dist = path.join(root, 'dist')

function fail(message) {
  console.error(`check-csp: ${message}`)
  process.exit(1)
}

const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
const rule = (vercel.headers ?? []).find((h) => h.source === '/(.*)')
const csp = rule?.headers.find((h) => h.key === 'Content-Security-Policy')?.value
if (!csp) fail('vercel.json has no Content-Security-Policy header on "/(.*)".')

const directives = Object.fromEntries(
  csp
    .split(';')
    .map((d) => d.trim().split(/\s+/))
    .filter((d) => d[0])
    .map(([name, ...values]) => [name, values]),
)
const scriptSrc = directives['script-src'] ?? fail('CSP has no script-src directive.')
for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'"]) {
  if (scriptSrc.includes(unsafe)) fail(`script-src must not contain ${unsafe}.`)
}
for (const required of ['default-src', 'object-src', 'base-uri', 'frame-ancestors']) {
  if (!directives[required]) fail(`CSP is missing ${required}.`)
}
const allowed = new Set(scriptSrc.filter((v) => /^'sha256-[A-Za-z0-9+/=]+'$/.test(v)).map((v) => v.slice(1, -1)))

/** Executable inline scripts: <script> without src, excluding JSON-LD data blocks. */
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g
const hashOf = (code) => `sha256-${crypto.createHash('sha256').update(code, 'utf8').digest('base64')}`

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

if (!fs.existsSync(dist)) fail('dist/ does not exist. Run the build first.')
const pages = [path.join(root, 'index.html'), ...walk(dist).filter((f) => f.endsWith('.html'))]
const used = new Set()
for (const page of pages) {
  for (const match of fs.readFileSync(page, 'utf8').matchAll(INLINE_SCRIPT)) {
    const hash = hashOf(match[1])
    used.add(hash)
    if (!allowed.has(hash)) {
      fail(
        `${path.relative(root, page)} has an inline script that the CSP does not allow.\n` +
          `  Add '${hash}' to script-src in vercel.json (and remove the old hash), or move the script to a file.`,
      )
    }
  }
}
const stale = [...allowed].filter((h) => !used.has(h))
if (stale.length) fail(`script-src allows hashes that match no inline script: ${stale.join(', ')}. Remove them.`)

console.log(`check-csp: ${pages.length} HTML files, ${used.size} inline script hash(es), all allowed by the CSP.`)
