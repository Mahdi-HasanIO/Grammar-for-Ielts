import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/*
 * The backend must never import the React app's code (or anything else
 * outside backend/). Content reaches it only as the JSON snapshots in
 * backend/seed/. This scans every backend source and test file.
 */
const BACKEND = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SCANNED = ['src', 'tests', 'vitest.config.ts']
const IMPORT = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+|\brequire\s*\(\s*)(['"])([^'"]+)\1/g

function files(entry: string): string[] {
  const full = path.join(BACKEND, entry)
  if (statSync(full).isFile()) return [full]
  return readdirSync(full, { recursive: true, encoding: 'utf8' })
    .filter((name) => /\.(c|m)?[jt]s$/.test(name))
    .map((name) => path.join(full, name))
}

function violations(file: string): string[] {
  const found: string[] = []
  for (const match of readFileSync(file, 'utf8').matchAll(IMPORT)) {
    const specifier = match[2] ?? ''
    if (specifier.startsWith('@/')) found.push(`${specifier} (the frontend's @/ alias)`)
    else if (specifier.startsWith('/') || specifier.startsWith('file:')) found.push(`${specifier} (absolute path)`)
    else if (specifier.startsWith('.')) {
      const target = path.resolve(path.dirname(file), specifier)
      if (path.relative(BACKEND, target).startsWith('..')) found.push(`${specifier} (outside backend/)`)
    }
  }
  return found
}

describe('import boundary', () => {
  // This file is skipped: its last test holds forbidden imports as sample strings.
  const all = SCANNED.flatMap(files).filter((file) => file !== fileURLToPath(import.meta.url))

  it('scans the backend', () => {
    expect(all.length).toBeGreaterThan(40)
  })

  it('no backend file imports anything outside backend/', () => {
    const problems = all.flatMap((file) => violations(file).map((v) => `${path.relative(BACKEND, file)}: ${v}`))
    expect(problems).toEqual([])
  })

  it('catches the imports it is meant to catch', () => {
    const probe = path.join(BACKEND, 'src', 'probe.ts')
    const check = (source: string) => {
      const found: string[] = []
      for (const match of source.matchAll(IMPORT)) {
        const specifier = match[2] ?? ''
        const target = path.resolve(path.dirname(probe), specifier)
        if (specifier.startsWith('@/') || (specifier.startsWith('.') && path.relative(BACKEND, target).startsWith('..'))) found.push(specifier)
      }
      return found
    }
    expect(check(`import { MODULES } from '../../src/data/modules.js'`)).toEqual(['../../src/data/modules.js'])
    expect(check(`import type { Question } from '@/types'`)).toEqual(['@/types'])
    expect(check(`const m = await import('../../src/data/lessons/index.ts')`)).toEqual(['../../src/data/lessons/index.ts'])
    expect(check(`import { x } from './services/x.js'`)).toEqual([])
  })
})
