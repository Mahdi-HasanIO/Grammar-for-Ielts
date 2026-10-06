/*
 * Serves the production build in dist/ the way Vercel does (see vercel.json),
 * so browser tests exercise the real prerendered pages, app shell and
 * service worker:
 * - trailingSlash: false  → /grammar/ redirects to /grammar
 * - cleanUrls: true       → /grammar/articles serves grammar/articles.html
 * - rewrites              → any other path serves app.html (status 200)
 * - headers               → copied from vercel.json
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
const headerRules = (vercel.headers ?? []).map((rule) => ({
  test: new RegExp(`^${rule.source.split('(.*)').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`),
  headers: rule.headers,
}))

function fileFor(pathname) {
  const candidates = pathname === '/' ? ['index.html'] : [pathname.slice(1), `${pathname.slice(1)}.html`]
  for (const rel of candidates) {
    const full = path.join(dist, rel)
    if (!full.startsWith(dist + path.sep)) return null
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full
  }
  return null
}

function handle(req, res) {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    res.writeHead(400).end()
    return
  }
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.writeHead(308, { Location: pathname.replace(/\/+$/, '') }).end()
    return
  }
  const file = fileFor(pathname) ?? path.join(dist, 'app.html')
  const headers = { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' }
  for (const rule of headerRules) {
    if (rule.test.test(pathname)) for (const h of rule.headers) headers[h.key] = h.value
  }
  res.writeHead(200, headers)
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
