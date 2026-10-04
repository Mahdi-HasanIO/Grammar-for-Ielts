/*
 * Runs after `vite build` (client) and `vite build --ssr` (server entry).
 *
 * 1. Prerenders every public page (home, grammar, blog, practice) to static HTML
 *    with its own title, description, canonical URL, Open Graph tags and JSON-LD,
 *    so search engines get the full content without running JavaScript.
 * 2. Writes app.html: the empty shell served for client-only routes (dashboard, course...).
 * 3. Writes sitemap.xml and robots.txt for the production domain.
 * 4. Writes offline-manifest.json and sw.js for Offline Mode.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const serverEntry = path.join(root, 'dist-server', 'entry-server.js')
const server = await import(pathToFileURL(serverEntry).href)

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const SEO_BLOCK = /<!-- seo:start -->[\s\S]*?<!-- seo:end -->/
const ROOT_DIV = '<div id="root"></div>'
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
  throw new Error('index.html is missing the seo markers or the empty #root element')
}

/* ---------------------------- App shell ---------------------------- */
fs.writeFileSync(path.join(dist, 'app.html'), template)

/* --------------------------- Prerendering -------------------------- */
const routes = server.indexableRoutes()
let rendered = 0
for (const route of routes.filter((r) => r.prerender)) {
  const html = await server.render(route.path)
  if (!/<h1[\s>]/.test(html)) throw new Error(`Prerendered ${route.path} has no <h1>`)
  if (/<template id="B:|aria-busy="true"/.test(html)) throw new Error(`Prerendered ${route.path} still contains a loading fallback`)
  const seo = server.getSeo(route.path)
  if (seo.noindex) throw new Error(`Indexable route ${route.path} resolved to noindex metadata`)
  const page = template
    .replace(SEO_BLOCK, server.headTagsToHtml(server.headTags(seo)))
    .replace(ROOT_DIV, `<div id="root">${html}</div>`)
  // Vercel's cleanUrls serves /grammar/articles from grammar/articles.html.
  const file = route.path === '/' ? 'index.html' : `${route.path.slice(1)}.html`
  fs.mkdirSync(path.dirname(path.join(dist, file)), { recursive: true })
  fs.writeFileSync(path.join(dist, file), page)
  rendered++
}

/* ------------------------- sitemap + robots ------------------------ */
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${server.SITE_URL}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${r.lastmod ?? today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)
fs.writeFileSync(
  path.join(dist, 'robots.txt'),
  `# Grammar for IELTS
User-agent: *
Allow: /

Sitemap: ${server.SITE_URL}/sitemap.xml
`,
)

/* --------------------- Offline manifest + worker ------------------- */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

const EXCLUDE = [/^\/sw\.js$/, /^\/offline-manifest\.json$/, /^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/app\.html$/, /\.map$/, /^\/og\//, /-og\.jpg$/]
const hash = crypto.createHash('sha256')
const files = walk(dist)
  .map((full) => {
    hash.update(full)
    hash.update(fs.readFileSync(full))
    return '/' + path.relative(dist, full).split(path.sep).join('/')
  })
  .filter((url) => !EXCLUDE.some((re) => re.test(url)))
  .map((url) => (url === '/index.html' ? '/' : url.endsWith('.html') ? url.slice(0, -5) : url))
  .sort()
// The app shell is fetched through a client-only route so the host's rewrite serves it.
files.unshift('/dashboard')
hash.update(fs.readFileSync(path.join(root, 'scripts', 'sw-template.js')))
const version = hash.digest('hex').slice(0, 12)

fs.writeFileSync(path.join(dist, 'offline-manifest.json'), JSON.stringify({ version, files }, null, 0))

const entryAssets = [...template.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1])
const shell = ['/dashboard', '/', '/manifest.webmanifest', '/favicon.png', '/icons/icon-192.png', ...entryAssets]
const sw = fs
  .readFileSync(path.join(root, 'scripts', 'sw-template.js'), 'utf8')
  .replace('__BUILD_ID__', version)
  .replace('__SHELL__', JSON.stringify([...new Set(shell)]))
fs.writeFileSync(path.join(dist, 'sw.js'), sw)

console.log(
  `postbuild: prerendered ${rendered} pages, sitemap with ${routes.length} URLs, offline manifest with ${files.length} files (version ${version})`,
)
