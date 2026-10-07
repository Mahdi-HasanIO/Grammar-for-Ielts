import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

/*
 * Content-access rules. They keep the static content adapter replaceable
 * (for example by an API client) without rewriting pages:
 * - src/data is private to the content layer: src/content (the synchronous
 *   catalogue and pure helpers) and src/services/content (the adapter);
 * - components, pages and hooks read content through ContentService;
 * - only routes that render lessons or questions import their packs, so the
 *   large banks stay out of every other page's bundle;
 * - every in-app content URL comes from src/content/paths.ts.
 */

const SRC = path.resolve(__dirname, '../../src')
const files = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(dir, e.name)] : [],
  )
const SOURCES = files(SRC).map((file) => ({ rel: path.relative(SRC, file).split(path.sep).join('/'), text: fs.readFileSync(file, 'utf8') }))
const importsOf = (text: string) => [...text.matchAll(/^\s*import\s[^'"]*?['"]([^'"]+)['"]/gm)].map((m) => m[1])
const inContentLayer = (rel: string) => rel.startsWith('data/') || rel.startsWith('content/') || rel.startsWith('services/content/')

describe('content access', () => {
  it('scans the source tree', () => {
    expect(SOURCES.length).toBeGreaterThan(80)
  })

  it('imports src/data only from the content layer', () => {
    const offenders = SOURCES.filter((f) => !inContentLayer(f.rel)).flatMap((f) =>
      importsOf(f.text)
        .filter((spec) => spec.startsWith('@/data') || /(^|\/)data\//.test(spec))
        .map((spec) => `${f.rel} → ${spec}`),
    )
    expect(offenders).toEqual([])
  })

  it('reads content in components, pages and hooks through ContentService, not the catalogue', () => {
    const ui = SOURCES.filter((f) => /^(components|pages|hooks)\//.test(f.rel))
    const offenders = ui.flatMap((f) => importsOf(f.text).filter((s) => s === '@/content/catalog').map((s) => `${f.rel} → ${s}`))
    expect(offenders).toEqual([])
  })

  it('imports the lesson and question packs only in routes that render them', () => {
    const importers = (pack: string) =>
      SOURCES.filter((f) => !f.rel.startsWith('services/content/') && importsOf(f.text).includes(`@/services/content/${pack}`))
        .map((f) => f.rel)
        .sort()
    expect(importers('lessonPack')).toEqual(['pages/Module.tsx', 'pages/public/GrammarTopic.tsx'])
    expect(importers('questionPack')).toEqual(['hooks/useAiPractice.ts', 'pages/Test.tsx', 'pages/public/GrammarTopic.tsx'])
  })

  it('keeps the content service free of network and backend code', () => {
    const service = SOURCES.filter((f) => f.rel.startsWith('services/content/'))
    for (const f of service) {
      expect(f.text, f.rel).not.toMatch(/\bfetch\(|XMLHttpRequest|axios|localStorage|sessionStorage/)
    }
  })
})

describe('content URLs are built in one place', () => {
  it('has no hand-built /module/, /learn/, /grammar/ or /blog/ page URLs outside content/paths.ts', () => {
    const offenders: string[] = []
    for (const f of SOURCES) {
      // paths.ts builds the URLs; App.tsx declares route patterns; blog articles are content.
      if (f.rel === 'content/paths.ts' || f.rel === 'app/App.tsx' || f.rel.startsWith('data/blog/')) continue
      f.text.split('\n').forEach((line, i) => {
        // Blog cover images are static files under /blog/covers/, not pages.
        if (/['"`]\/(module|learn|grammar|blog)\//.test(line.replace(/\/blog\/covers\//g, ''))) {
          offenders.push(`${f.rel}:${i + 1}: ${line.trim()}`)
        }
      })
    }
    expect(offenders).toEqual([])
  })
})
