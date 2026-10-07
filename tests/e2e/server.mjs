/*
 * Serves the production build in dist/ the way Vercel does, following the
 * routing rules in vercel.json, so browser tests exercise the real
 * prerendered pages, app shell and service worker:
 * - trailingSlash: false  → /grammar/ redirects (308) to /grammar
 * - cleanUrls: true       → /grammar/articles serves grammar/articles.html,
 *                           and /x.html redirects (308) to /x
 * - filesystem first, then rewrites. A rewrite destination is resolved by
 *   the same rules, so with cleanUrls a destination like "/app.html" does
 *   not resolve (Vercel answers 404 for it, as found on a real deployment)
 * - nothing resolves      → 404
 * - headers               → copied from vercel.json, on every response
 *
 * Usage: node tests/e2e/server.mjs [port]   (default 4173)
 * Or import { startServer } to start and stop an instance from a test.
 */
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const dist = path.join(root, 'dist')
const vercel = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

/** vercel.json `source` patterns used here are literal paths with optional `(.*)` groups. */
const pattern = (source) =>
  new RegExp(`^${source.split('(.*)').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`)
const headerRules = (vercel.headers ?? []).map((rule) => ({ test: pattern(rule.source), headers: rule.headers }))
const rewrites = (vercel.rewrites ?? []).map((rule) => ({ test: pattern(rule.source), destination: rule.destination }))
const cleanUrls = vercel.cleanUrls === true

/** Resolves a path to a file in dist/, as Vercel's filesystem step does. */
function fileFor(pathname) {
  // With cleanUrls, .html URLs are never served directly: they redirect to the clean URL.
  if (cleanUrls && pathname.endsWith('.html')) return null
  const candidates = pathname === '/' ? ['index.html'] : [pathname.slice(1), ...(cleanUrls ? [`${pathname.slice(1)}.html`] : [])]
  for (const rel of candidates) {
    const full = path.join(dist, rel)
    if (!full.startsWith(dist + path.sep)) return null
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full
  }
  return null
}

function resolve(pathname) {
  const file = fileFor(pathname)
  if (file) return file
  const rewrite = rewrites.find((r) => r.test.test(pathname))
  return rewrite ? fileFor(rewrite.destination) : null
}

function handle(req, res) {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end()
    return
  }
  const headers = {}
  for (const rule of headerRules) {
    if (rule.test.test(pathname)) for (const h of rule.headers) headers[h.key] = h.value
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(308, { ...headers, Location: pathname.replace(/\/+$/, '') }).end()
    return
  }
  if (cleanUrls && pathname.endsWith('.html')) {
    const clean = pathname.replace(/\.html$/, '')
    res.writeHead(308, { ...headers, Location: clean === '/index' ? '/' : clean }).end()
    return
  }
  const file = resolve(pathname)
  if (!file) {
    res.writeHead(404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }).end('The page could not be found')
    return
  }
  res.writeHead(200, { ...headers, 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' })
  if (req.method === 'HEAD') res.end()
  else fs.createReadStream(file).pipe(res)
}

export function startServer(port = 0) {
  if (!fs.existsSync(path.join(dist, 'app.html'))) {
    throw new Error('dist/ has no production build. Run `npm run build` first.')
  }
  const server = http.createServer(handle)
  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      const { port: actual } = server.address()
      resolve({
        url: `http://127.0.0.1:${actual}`,
        /** Stops the server and drops open keep-alive connections, so the origin is really unreachable. */
        close: () =>
          new Promise((done) => {
            server.close(() => done())
            server.closeAllConnections()
          }),
      })
    })
  })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await startServer(Number(process.argv[2] ?? 4173))
  console.log(`Serving dist/ at ${url}`)
}
