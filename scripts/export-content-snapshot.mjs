/*
 * One-off export of the static course and blog content into JSON snapshots
 * for the backend: backend/seed/*.json, which are committed. The backend
 * seed script (backend/src/scripts/seed-content.ts) reads only those files;
 * the backend never imports the React app's source.
 *
 * Read-only: loads the frontend's data modules through Vite (so the @/ alias
 * and TypeScript work as in the app) and writes nothing outside backend/seed.
 * The output has no timestamps, so re-running it on unchanged content gives
 * identical files.
 *
 *   node scripts/export-content-snapshot.mjs           write the snapshots
 *   node scripts/export-content-snapshot.mjs --check   exit 1 if they are out of date
 *
 * The static content stays the source for SEO and the offline app; the
 * snapshots only seed the database behind the content API.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'backend', 'seed')
const check = process.argv.includes('--check')

const server = await createServer({
  root,
  logLevel: 'error',
  appType: 'custom',
  server: { middlewareMode: true, hmr: false, ws: false },
  optimizeDeps: { noDiscovery: true, include: [] },
})

try {
  const load = (file) => server.ssrLoadModule(file)
  const { MODULES, STAGES } = await load('/src/data/modules.ts')
  const { MODULES_EN, STAGES_EN } = await load('/src/data/modulesEn.ts')
  const { GRAMMAR_TOPICS, FEATURED_TOPIC_SLUGS } = await load('/src/data/grammarTopics.ts')
  const { LESSONS, LESSONS_EN } = await load('/src/data/lessons/index.ts')
  const { PRACTICE_QUESTIONS, TEST_QUESTIONS } = await load('/src/data/questions/index.ts')
  const { BLOG_CATEGORIES, BLOG_POSTS } = await load('/src/data/blog/posts.ts')
  const { ARTICLES } = await load('/src/data/blog/articles.ts')

  const snapshots = {
    'catalog.json': {
      stages: STAGES,
      stagesEn: STAGES_EN,
      modules: MODULES,
      modulesEn: MODULES_EN,
      topics: GRAMMAR_TOPICS,
      featuredTopicSlugs: FEATURED_TOPIC_SLUGS,
    },
    'lessons.json': { bn: LESSONS, en: LESSONS_EN },
    'questions.json': { practice: PRACTICE_QUESTIONS, test: TEST_QUESTIONS },
    'blog.json': { categories: BLOG_CATEGORIES, posts: BLOG_POSTS, articles: ARTICLES },
  }

  await mkdir(outDir, { recursive: true })
  const stale = []
  for (const [name, value] of Object.entries(snapshots)) {
    const file = path.join(outDir, name)
    const json = `${JSON.stringify(value, null, 2)}\n`
    if (check) {
      const current = await readFile(file, 'utf8').catch(() => '')
      if (current !== json) stale.push(name)
    } else {
      await writeFile(file, json)
      console.log(`wrote backend/seed/${name} (${(json.length / 1024).toFixed(0)} kB)`)
    }
  }
  if (check) {
    if (stale.length) {
      console.error(`Out of date: ${stale.join(', ')}. Run: node scripts/export-content-snapshot.mjs`)
      process.exitCode = 1
    } else {
      console.log('Content snapshots are up to date.')
    }
  }
} finally {
  await server.close()
}
