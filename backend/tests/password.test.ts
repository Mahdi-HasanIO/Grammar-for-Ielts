import { describe, expect, it } from 'vitest'
import { createArgon2Hasher, dummyHash } from '../src/services/password.js'

describe('argon2id hasher (production parameters)', () => {
  const hasher = createArgon2Hasher()

  it('uses argon2id with the OWASP baseline: 19 MiB, 2 iterations, 1 lane', async () => {
    const hash = await hasher.hash('correct horse battery')
    expect(hash).toMatch(/^\$argon2id\$v=19\$m=19456,p=1,t=2\$/)
  })

  it('salts every hash', async () => {
    expect(await hasher.hash('same password')).not.toBe(await hasher.hash('same password'))
  })

  it('verifies the right password and rejects others', async () => {
    const hash = await hasher.hash('correct horse battery')
    expect(await hasher.verify(hash, 'correct horse battery')).toBe(true)
    expect(await hasher.verify(hash, 'correct horse batterY')).toBe(false)
  })

  it('returns false instead of throwing for a malformed hash', async () => {
    expect(await hasher.verify('not-a-hash', 'anything')).toBe(false)
  })

  it('makes the dummy hash once and reuses it', async () => {
    const get = dummyHash(hasher)
    const first = await get()
    expect(first).toMatch(/^\$argon2id\$/)
    expect(await get()).toBe(first)
  })
})
