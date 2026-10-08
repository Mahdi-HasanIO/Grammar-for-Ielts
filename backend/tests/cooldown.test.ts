import { describe, expect, it } from 'vitest'
import { createMemoryCooldown } from '../src/services/cooldown.js'

describe('createMemoryCooldown', () => {
  it('allows a key once per window', () => {
    let now = 0
    const cooldown = createMemoryCooldown({ windowMs: 1_000, now: () => new Date(now) })
    expect(cooldown.tryStart('a')).toBe(true)
    expect(cooldown.tryStart('a')).toBe(false)
    expect(cooldown.tryStart('b')).toBe(true)
    now = 999
    expect(cooldown.tryStart('a')).toBe(false)
    now = 1_000
    expect(cooldown.tryStart('a')).toBe(true)
  })

  it('a refused attempt does not extend the window', () => {
    let now = 0
    const cooldown = createMemoryCooldown({ windowMs: 1_000, now: () => new Date(now) })
    cooldown.tryStart('a')
    now = 900
    cooldown.tryStart('a')
    now = 1_000
    expect(cooldown.tryStart('a')).toBe(true)
  })

  it('stays bounded in memory', () => {
    let now = 0
    const cooldown = createMemoryCooldown({ windowMs: 1_000_000, now: () => new Date(now), maxEntries: 100 })
    for (let i = 0; i < 1_000; i++) {
      now = i
      cooldown.tryStart(`k${i}`)
    }
    // The oldest keys were evicted to stay within maxEntries, so they are allowed again.
    expect(cooldown.tryStart('k0')).toBe(true)
    expect(cooldown.tryStart('k999')).toBe(false)
  })
})
